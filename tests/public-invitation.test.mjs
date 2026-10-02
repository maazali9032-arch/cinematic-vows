import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import ts from "typescript";

// Validate the production boundary without credentials or network requests.
let response;
let clientsCreated = 0;
let clientOptions;
const calls = [];
const testEnv = {
  VITE_SUPABASE_URL: "https://test.invalid",
  VITE_SUPABASE_ANON_KEY: "placeholder",
};
const source = readFileSync(
  new URL("../src/lib/public-invitation.ts", import.meta.url),
  "utf8",
).replaceAll("import.meta.env", "testEnv");
const exports = {};
vm.runInNewContext(
  ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  {
    exports,
    testEnv,
    URL,
    Date,
    require: () => ({
      createClient: (_url, _key, options) => {
        clientsCreated++;
        clientOptions = options;
        return {
          rpc: async (name, payload) => {
            calls.push([name, payload]);
            if (response instanceof Error) throw response;
            return response;
          },
        };
      },
    }),
  },
);
const { fetchPublicInvitation, slugFromPath, safeUrl } = exports;
for (const path of ["/", "/%", "/%2F", "/%5C"]) assert.equal(slugFromPath(path), null);
assert.equal(slugFromPath("/prefix/couple%20name/"), "couple name");
assert.equal(slugFromPath("/name%252F"), "name%2F");
for (const value of ["javascript:alert(1)", "data:text/html,test", {}, null])
  assert.equal(safeUrl(value), "");
response = { data: { state: "live", content: {} } };
let result = await fetchPublicInvitation("minimal");
assert.equal(result.state, "live");
assert.equal(result.invitation.groomName, "");
assert.equal(result.invitation.events.length, 0);
assert.equal(result.invitation.profiles.length, 0);
assert.equal(result.invitation.music.enabled, false);
assert.equal(result.invitation.publicUrl, null);
assert.equal(calls.length, 1);
assert.equal(calls[0][0], "get_public_invitation_content");
assert.equal(calls[0][1].p_slug, "minimal");
assert.equal(clientOptions.auth.detectSessionInUrl, false);
assert.equal(clientOptions.auth.persistSession, false);
response = {
  data: {
    data: {
      state: "live",
      invitation: { public_url: "https://public.example/exact%20url" },
      shop: { name: "Approved brand", phone: "MUST NOT LEAK" },
      content: {
        groom_photo_url: "https://media.example/photo.jpg",
        groom_qualification: "Degree",
        bride_parents: "Family",
        music_enabled: true,
        music_url: "https://media.example/music.mp3",
        events: [null, [], { title: "Ceremony", description: "Event note" }],
        gallery: [
          null,
          {},
          "javascript:bad",
          "https://media.example/one.jpg",
          { image_url: "https://media.example/two.jpg", width: {} },
        ],
        contacts: [
          { phone: " +91 90000 00000 " },
          { name: "Missing phone" },
          { phone: "third ignored" },
        ],
      },
    },
  },
};
result = await fetchPublicInvitation("complete");
assert.equal(result.brandName, "Approved brand");
assert.equal(result.invitation.profiles.length, 2);
assert.equal(result.invitation.gallery.length, 2);
assert.equal(result.invitation.gallery[1].width, 900);
assert.equal(result.invitation.events[0].note, "Event note");
assert.equal(result.invitation.contacts.length, 1);
assert.equal(result.invitation.contacts[0].phone, "+91 90000 00000");
assert.equal(result.invitation.music.enabled, true);
assert.equal(result.invitation.publicUrl, "https://public.example/exact%20url");
assert.equal(JSON.stringify(result).includes("MUST NOT LEAK"), false);
response = {
  data: {
    state: "live",
    content: {
      wedding_date: "2099-09-20",
      start_time: "19:30:00",
      end_time: "21:00",
      events: [
        { name: "", title: "Reception", time: "", start_time: "19:30", description: "Join us" },
        { note: "Family gathering" },
      ],
      gallery: [{ url: "javascript:bad", src: "https://media.example/valid.jpg" }],
    },
  },
};
result = await fetchPublicInvitation("aliases");
assert.equal(result.invitation.weddingDateLabel, "September 20, 2099");
assert.equal(result.invitation.startTime, "7:30 PM");
assert.equal(result.invitation.endTime, "9:00 PM");
assert.equal(result.invitation.events[0].name, "Reception");
assert.equal(result.invitation.events[0].time, "7:30 PM");
assert.equal(result.invitation.events.length, 2);
assert.equal(result.invitation.gallery[0].src, "https://media.example/valid.jpg");
assert.equal(clientsCreated, 1);
response = {
  data: {
    state: "fallback",
    shop: { name: "Shop", address: "Street", city: "City" },
    content: { groom_name: "MUST NOT LEAK" },
  },
};
result = await fetchPublicInvitation("closed");
assert.equal(result.state, "fallback");
assert.equal(JSON.stringify(result).includes("MUST NOT LEAK"), false);
assert.equal(result.shop.location, "Street, City");
for (const payload of [null, [], { state: "unknown" }, { state: "live", content: [] }]) {
  response = { data: payload };
  assert.equal((await fetchPublicInvitation("invalid")).state, "request_error");
}
response = { data: { state: "not_found", content: { groom_name: "MUST NOT LEAK" } } };
assert.equal(JSON.stringify(await fetchPublicInvitation("absent")), '{"state":"not_found"}');
response = new Error("Network");
assert.equal((await fetchPublicInvitation("offline")).state, "request_error");
for (const date of ["2099-99-01", "2099-02-30", "invalid"]) {
  response = { data: { state: "live", content: { wedding_date: date, start_time: "10:30" } } };
  const invalidDateResult = await fetchPublicInvitation("invalid-date");
  assert.equal(invalidDateResult.state, "live");
  assert.equal(invalidDateResult.invitation.weddingDateISO, "");
}
testEnv.VITE_SUPABASE_ANON_KEY = "";
assert.equal((await fetchPublicInvitation("config")).state, "request_error");
console.log("Public invitation contract checks passed.");

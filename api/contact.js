const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_TO_EMAIL = "pcdocjp79@gmail.com";

const json = (res, statusCode, payload) => {
  res.status(statusCode);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.send(JSON.stringify(payload));
};

const toTrimmedText = (value, maxLength = 5000) => {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\r\n/g, "\n").slice(0, maxLength);
};

const toSingleLineText = (value, maxLength = 240) =>
  toTrimmedText(value, maxLength).replace(/[\r\n]+/g, " ");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidUrl = (value) => {
  if (!value) return true;

  try {
    const parsedUrl = new URL(value);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch (_error) {
    return false;
  }
};

const getRequestBody = (req) => {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (_error) {
      return null;
    }
  }

  return req.body;
};

const normalizePayload = (body) => ({
  name: toSingleLineText(body?.name, 120),
  email: toSingleLineText(body?.email, 160).toLowerCase(),
  projectType: toSingleLineText(body?.projectType, 120),
  website: toSingleLineText(body?.website, 240),
  message: toTrimmedText(body?.message, 5000),
  company: toSingleLineText(body?.company, 120),
});

const buildPlainTextMail = (payload) =>
  [
    "Neue Anfrage ueber das Kontaktformular",
    "",
    `Name: ${payload.name || "-"}`,
    `E-Mail: ${payload.email || "-"}`,
    `Projektart: ${payload.projectType || "-"}`,
    `Website: ${payload.website || "-"}`,
    "",
    "Nachricht:",
    payload.message || "-",
  ].join("\n");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Methode nicht erlaubt." });
  }

  const requestBody = getRequestBody(req);

  if (requestBody === null) {
    return json(res, 400, { error: "Ungueltige Anfrage." });
  }

  const payload = normalizePayload(requestBody);

  if (payload.company) {
    return json(res, 200, { ok: true });
  }

  if (!payload.name || !payload.email) {
    return json(res, 400, {
      error: "Bitte fuelle mindestens die Pflichtfelder Name und E-Mail aus.",
    });
  }

  if (!isValidEmail(payload.email)) {
    return json(res, 400, {
      error: "Bitte gib eine gueltige E-Mail-Adresse an.",
    });
  }

  if (!isValidUrl(payload.website)) {
    return json(res, 400, {
      error: "Bitte gib eine gueltige Website-URL mit http oder https an.",
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  const toEmail = process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return json(res, 500, {
      error: "Mailversand ist noch nicht fertig konfiguriert.",
    });
  }

  let resendResponse;

  try {
    resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: `Neue Anfrage ueber das Kontaktformular - ${payload.name}`,
        text: buildPlainTextMail(payload),
        reply_to: payload.email,
      }),
    });
  } catch (error) {
    console.error("Resend request failed", error);
    return json(res, 500, {
      error: "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es spaeter erneut.",
    });
  }

  if (!resendResponse.ok) {
    const resendErrorText = await resendResponse.text();
    console.error("Resend send failed", resendErrorText);
    return json(res, 500, {
      error: "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuche es spaeter erneut.",
    });
  }

  return json(res, 200, { ok: true });
}

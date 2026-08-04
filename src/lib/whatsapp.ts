export const sendWhatsAppMessage = async (
  toPhoneNumber: string,
  templateName: string,
  languageCode: string = "en",
  components: any[] = []
) => {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID; // Fallback for now if phone ID isn't provided

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("WhatsApp API credentials missing.");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toPhoneNumber,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: languageCode,
            },
            components: components,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("WhatsApp Request Failed:", error);
    return false;
  }
};

export const sendWhatsAppText = async (toPhoneNumber: string, text: string) => {
  const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
  const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;

  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn("WhatsApp API credentials missing.");
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: toPhoneNumber,
          type: "text",
          text: {
            preview_url: false,
            body: text,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("WhatsApp API Error:", data);
      return false;
    }

    return true;
  } catch (error) {
    console.error("WhatsApp Request Failed:", error);
    return false;
  }
};

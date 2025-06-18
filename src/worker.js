export default {
  async email(message, env, ctx) {
    const subject = message.headers.get("subject");
    if (!subject || subject.trim() === "") {
      await message.reply({
        subject:"Email subject is required",
        body:"",
      });
    } else {
      await message.reply({
        subject: "ReVanced received your Email",
        body: "ReVanced received your email and will get back to you shortly. However, please note, support or help is not provided and will not be replied to.",
      });
    }

    await message.forward("revanced@osumatrix.me");
  }
}
# Email rate limit (Supabase)

## What you're seeing

"Email rate limit exceeded" comes from **Supabase**, not from our app. Supabase’s built-in email has a fixed limit of about **4 emails per hour** per project. That limit **cannot be increased** in code or in the dashboard when using built-in email.

## What we did in the app

- **Friendly message**: When Supabase returns a rate limit error, we show a clear message and suggest using **password login** if the user already has an account.
- **60-second cooldown**: After sending a magic link / sign-up email / reset email, the "Send" button is disabled for 60 seconds and shows "请 60 秒后再试". This reduces accidental double-clicks and avoids burning through the limit.

So users get at least **password login** as a way to sign in without sending another email.

## How to allow more emails (production)

To allow more than ~4 auth emails per hour, use **custom SMTP** in Supabase:

1. In **Supabase Dashboard** → **Project** → **Authentication** → **SMTP Settings** (or **Email** / **Providers**).
2. Enable **Custom SMTP** and configure a provider, for example:
   - [Resend](https://resend.com)
   - [SendGrid](https://sendgrid.com)
   - [AWS SES](https://aws.amazon.com/ses/)
   - [Postmark](https://postmarkapp.com)
   - [Brevo](https://www.brevo.com)
3. After that, Supabase will send auth emails through your SMTP; the built-in 4/hour limit no longer applies, and you follow your provider’s limits instead (usually much higher).

Docs: [Send emails with custom SMTP | Supabase](https://supabase.com/docs/guides/auth/auth-smtp)

## Industry practice

Limiting auth emails (e.g. 3–10 per hour per address or per IP) is standard to prevent abuse and spam. Supabase’s default is strict; custom SMTP lets you set your own policy.

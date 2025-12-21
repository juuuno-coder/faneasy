/**
 * Notification Service (Item 3)
 * Handles sending alerts to Slack, Discord, or Email.
 */

export async function sendAdminNotification(message: string, context?: any) {
  // In a real environment, you would use a Webhook URL from your env variables
  const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

  console.log(`[Notification] Sending to Admin: ${message}`, context);

  if (!SLACK_WEBHOOK_URL) {
    console.warn('SLACK_WEBHOOK_URL is not set. Skipping Slack notification.');
    return;
  }

  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🚀 *New Project Inquiry*\n\n> ${message}\n\n*Details:*\n${JSON.stringify(context, null, 2)}`,
        mrkdwn: true,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return false;
  }
}

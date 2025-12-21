/**
 * Vercel Domain Management Helper (Item 19)
 * Provides utilities to associate custom domains with your project programmatically.
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

export async function addDomainToVercel(domain: string) {
  if (!VERCEL_TOKEN || !PROJECT_ID) {
    console.error('VERCEL_TOKEN or PROJECT_ID is missing');
    return null;
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v10/projects/${PROJECT_ID}/domains`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: domain }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error adding domain to Vercel:', error);
    return null;
  }
}

export async function checkDomainStatus(domain: string) {
  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects/${PROJECT_ID}/domains/${domain}/config`,
      {
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error checking domain status:', error);
    return null;
  }
}

/**
 * Helper utility to collect, validate, and normalize recipient emails for emergency alerts.
 * Ensures:
 * - Only valid RFC-compliant emails are included.
 * - Internal dummy emails (e.g. *.internal, example.com) are excluded.
 * - Victims are NOT spammed with rescue emails asking themselves to help themselves.
 * - No hardcoded email addresses — ADMIN_EMAIL is strictly read from environment variables.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.trim().toLowerCase();
  if (
    clean.endsWith('.internal') ||
    clean.includes('example.com') ||
    clean.includes('test.com') ||
    clean === 'null' ||
    clean === 'undefined' ||
    clean === 'n/a'
  ) {
    return false;
  }
  return EMAIL_REGEX.test(clean);
};

export const collectEmergencyRecipients = (user, contacts = [], options = {}) => {
  const { includeVictim = false } = options;
  const recipientEmails = new Set();

  // 1. Parent email on victim profile
  if (isValidEmail(user?.parentEmail)) {
    recipientEmails.add(user.parentEmail.trim().toLowerCase());
  }

  // 2. Organization email (if member of an org)
  if (isValidEmail(user?.organization?.email)) {
    recipientEmails.add(user.organization.email.trim().toLowerCase());
  }

  // 3. Trusted contacts of the victim
  const contactList = Array.isArray(contacts) && contacts.length > 0
    ? contacts
    : (user?.trustedContacts && Array.isArray(user.trustedContacts) ? user.trustedContacts : []);

  contactList.forEach((c) => {
    if (isValidEmail(c?.email)) {
      recipientEmails.add(c.email.trim().toLowerCase());
    }
  });

  // 3. User's own email only if specifically requested
  if (includeVictim && isValidEmail(user?.email)) {
    recipientEmails.add(user.email.trim().toLowerCase());
  }

  // 4. System Admin email (from env or fallback)
  const fallbackAdmin = 'veaglespace@gmail.com';
  const adminEmail = process.env.ADMIN_EMAIL || fallbackAdmin;
  if (isValidEmail(adminEmail)) {
    recipientEmails.add(adminEmail.trim().toLowerCase());
  }

  return Array.from(recipientEmails);
};

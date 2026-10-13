# Customer Management Guide

## Overview

The Customer Management feature allows administrators to manage customer accounts directly from the admin dashboard. You can invite new customers, edit their information, reset passwords, and delete accounts.

## Accessing Customer Management

1. Log in to the admin dashboard
2. Click on the **Customers** button in the sidebar (with the Users icon)
3. You'll see a list of all customer accounts

## Features

### 1. View Customer List

The customer management page displays:
- Customer name
- Email address
- Phone number (if provided)
- Company name (if provided)
- Search functionality to filter customers

### 2. Invite New Customer

To invite a new customer:

1. Click the **Invite Customer** button in the top-right corner
2. Fill in the customer details:
   - **Full Name** (required)
   - **Email** (required)
   - **Phone** (optional)
   - **Company** (optional)
   - **Password** (optional - will be auto-generated if left empty)
3. Click **Invite Customer**
4. The system will:
   - Create the customer account
   - Send a welcome email with login credentials (if EmailJS is configured)
   - Display the password in a notification (if email is not configured)

**Note:** If EmailJS is not configured, the password will be shown in the success notification. Make sure to communicate this to the customer securely.

### 3. Edit Customer Information

To edit a customer's details:

1. Find the customer in the list
2. Click the **Edit** icon (pencil) on the right side
3. Update the information:
   - Full Name
   - Email
   - Phone
   - Company
4. Click **Save Changes**
5. The customer will need to use the new email for future logins

**Note:** Changing a customer's email will affect their login credentials. Make sure to inform the customer of the change.

### 4. Reset Customer Password

To reset a customer's password:

1. Find the customer in the list
2. Click the **Reset Password** icon (key) on the right side
3. Choose one of two options:
   - **Auto-generate password**: The system will create a secure random password
   - **Manual password**: Enter a custom password (minimum 6 characters)
4. Click **Reset Password**
5. The system will:
   - Update the password
   - Send an email with the new password (if EmailJS is configured)
   - Display the password in a notification (if email is not configured)

**Note:** If EmailJS is not configured, the new password will be shown in the success notification. Make sure to communicate this to the customer securely.

### 5. Delete Customer Account

To delete a customer account:

1. Find the customer in the list
2. Click the **Delete** icon (trash) on the right side
3. Confirm the deletion in the modal
4. The customer account will be permanently deleted

**Warning:** This action cannot be undone. All customer data will be lost, including:
- Login credentials
- Customer profile information
- Note: Tickets created by the customer will remain in the system but will no longer be associated with an active account

## Search and Filter

Use the search bar at the top of the customer list to filter customers by:
- Name
- Email
- Company

The search is case-insensitive and updates in real-time.

## Email Notifications

If EmailJS is configured in the admin settings:
- Welcome emails are sent when inviting customers
- Password reset emails are sent when resetting passwords

If EmailJS is not configured:
- Passwords are displayed in the success notification
- You must manually communicate credentials to customers

## Security Best Practices

1. **Strong Passwords**: When creating manual passwords, use strong, unique passwords
2. **Secure Communication**: If passwords are shown in notifications, communicate them to customers securely (not via email)
3. **Regular Audits**: Periodically review customer accounts and remove inactive ones
4. **Email Verification**: Consider implementing email verification for new customers (future feature)
5. **Access Control**: Only grant admin access to trusted personnel

## Customer Account Lifecycle

### Invitation Flow
1. Admin invites customer
2. Customer account is created
3. Welcome email sent (or password shown in notification)
4. Customer logs in with provided credentials
5. Customer can access the customer portal

### Password Reset Flow
1. Admin initiates password reset
2. New password is generated or entered
3. Password reset email sent (or password shown in notification)
4. Customer logs in with new password
5. Customer can continue using the portal

### Account Deletion Flow
1. Admin initiates account deletion
2. Confirmation modal appears
3. Admin confirms deletion
4. Customer account is permanently removed
5. Customer can no longer access the portal

## Troubleshooting

### Customer Not Receiving Email
- Check EmailJS configuration in admin settings
- Verify the customer's email address is correct
- Check spam/junk folder
- If email is not configured, check the success notification for the password

### Cannot Edit Customer
- Ensure you have admin privileges
- Check if the email is already in use by another customer
- Verify the customer account exists

### Cannot Delete Customer
- Ensure you have admin privileges
- Confirm the deletion in the modal
- Check browser console for errors

## Future Enhancements

Potential features for future versions:
- Bulk customer import/export
- Email verification for new customers
- Customer account status (active/suspended)
- Customer activity logs
- Password expiration policies
- Two-factor authentication
- Customer self-service password reset
- Customer groups/segments

## API Reference (Internal)

### Customer Management Functions

```typescript
// Get all customers
getUsers(): User[]

// Register a new customer
registerCustomer(userData: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  company?: string;
}): User | null

// Reset customer password
resetPassword(email: string, newPassword: string): boolean

// Generate temporary password
generateTemporaryPassword(): string

// Send password reset email
sendPasswordResetEmail(
  email: string,
  name: string,
  temporaryPassword: string
): Promise<boolean>
```

## Support

For technical support or feature requests, please contact the development team.

---

**Last Updated:** 2024
**Version:** 1.6.0 (Customer Management)
**Status:** ✅ Complete and Tested

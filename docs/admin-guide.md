# Admin Guide

Outside of the contributor role, there is an `admin` role that grants the following abilities:

- Approve/reject a pending user on the [Contributor Waitlist](https://ai-to.ai/admin)
- Remove (delete) LLM from the platform
- Remove a spammy/abusive contributor from the platform
- Remove a spammy/absive vote from an LLM

Admin access can be granted by setting a `User`'s role to `admin` in the database. In development mode, an initial admin is set for you when you seed the database. In production, you have to manually set the role by running an SQL query.

## Approving/Rejecting a Contributor

1. Navigate to the [Contributor Waitlist](https://ai-to.ai/admin)
2. You will see a list of users who signed up to be a contributor
3. You can view a user's github profile

# Admin Guide

Outside of the contributor role, there is an `admin` role that grants the following abilities:

- Approve/reject a pending user on the [Contributor Waitlist](https://llmarena.ai/admin)
- Remove (delete) LLM from the platform
- Remove a spammy/abusive contributor from the platform
- Remove a spammy/absive vote from an LLM

Admin access can be granted by setting a `User`'s role to `admin` in the database. In development mode, an initial admin is set for you when you seed the database. In production, you have to manually set the role by running an SQL query.

## Approving/Rejecting a Contributor

1. Navigate to the [Contributor Waitlist](https://llmarena.ai/admin)
2. You will see a list of users who signed up to be a contributor
3. You can view a user's github profile

## Removing an LLM

1. Open an LLM on the [LLMs page](https://llmarena.ai/llms)
2. In the upper-right corner, click the three dots
3. If you want to simply remove the LLM from the platform, click "Remove LLM". If you want to revoke the contributor as well (for abuse/spam), click "Remove & Revoke Contributor"

## Removing a Vote

1. Click the three dots next to a vote comment
2. Click "Remove Vote" to remove the vote
3. To revoke the contributor, select the second option "Remove & Revoke Contributor"

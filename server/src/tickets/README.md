# Support Tickets Module

Lets clients open support requests and any staff/admin respond, with status
tracking the back-and-forth automatically.

## Status flow

```
Client creates ticket        -> OPEN
Staff/admin replies          -> ANSWERED   (+ email sent to the client)
Client replies               -> CUSTOMER_REPLY
Staff/admin closes            -> CLOSED
Owner or staff/admin reopens  -> OPEN
```

The status always reflects "whose turn it is to respond" — `ANSWERED` means
the client has something new to read, `CUSTOMER_REPLY` means staff do.

## Design notes

- **The opening message is the first reply, not a separate field.** A
  ticket's conversation thread (`TicketReply`, ordered by `createdAt`) holds
  everything, including the original request — simpler than juggling a
  `ticket.description` field plus a separate replies list, and it's how
  most helpdesk systems (Zendesk, WHMCS, Blesta) model it.
- **Any staff role can answer any ticket** — `isStaffRole()` (from
  `common/enums/role.enum.ts`) covers `ADMIN`, `SUPPORT_AGENT`,
  `DEVELOPER`, and `DEVOPS_ENGINEER`, matching your three service lines.
  There's no hard assignment/routing — `assignedStaffId` is set
  automatically to whoever answers first, purely for visibility (e.g. "who's
  been handling this"), and never restricts who else can reply.
- **A closed ticket can't be replied to directly** — `addReply` throws a
  clear `BadRequestException` telling the caller to reopen it first. This
  stops a client from bumping a resolved ticket back to `ANSWERED`/
  `CUSTOMER_REPLY` by accident days later; reopening is an explicit action.
- **No attachments**, per the current spec — `CreateReplyDto`/`CreateTicketDto`
  are plain text. If you add attachments later, the `pdf`/general file-upload
  handling would live as a new field on `TicketReply` (e.g. an array of
  stored file paths/URLs) rather than changing the status model above.
- **Email only fires in one direction right now**: client gets notified when
  staff answers (per the spec). Staff are *not* currently emailed when a
  client replies (`CUSTOMER_REPLY`) — see "Suggested next steps".

## Endpoints (prefixed `/api/v1`, all require auth)

| Method | Route                        | Who                          | Notes |
|--------|-------------------------------|-------------------------------|-------|
| POST   | `/support-tickets`             | Any authenticated user        | Creates ticket, status `OPEN` |
| GET    | `/support-tickets`              | Any authenticated user        | Clients see only their own; staff/admin see all. Filters: `status`, `department`, `priority`, `page`, `limit` |
| GET    | `/support-tickets/:id`          | Owner or staff/admin          | Full thread, oldest first |
| POST   | `/support-tickets/:id/reply`    | Owner or staff/admin          | Staff reply → `ANSWERED` + client email; client reply → `CUSTOMER_REPLY` |
| POST   | `/support-tickets/:id/close`    | **Staff/admin only**          | → `CLOSED` |
| POST   | `/support-tickets/:id/reopen`   | Owner or staff/admin          | → `OPEN` |

## Suggested next steps

- Notify staff (e.g. a shared support-team inbox, or whoever's
  `assignedStaffId`) when a client leaves a `CUSTOMER_REPLY` — mirrors the
  client-facing notification already in place.
- Add attachments once you're ready — see the design note above for where
  that would plug in.
- Add a `GET /support-tickets/:id/replies` count or "unread" flag if you want
  the ticket list to show at-a-glance which tickets need attention.
- If ticket volume grows, consider real assignment (a "claim this ticket"
  action) rather than the current first-responder auto-assignment.

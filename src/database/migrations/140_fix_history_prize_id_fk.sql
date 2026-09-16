-- 140_fix_history_prize_id_fk.sql
--
-- Bug fix: spin_history.prize_id and scratch_history.prize_id each carry a
-- hard foreign key to their respective NORMAL prize table (spin_prizes /
-- scratch_prizes, from migration 118/137) — but since migration 139 added
-- the first-time-reward pools (spin_first_time_prizes /
-- scratch_first_time_prizes) as separate tables with their own UUID
-- namespace, a winning first-time prize's id is never present in the
-- normal table. Every first-time win's insertHistory() call violated this
-- FK and crashed the whole spin/scratch with a generic 500-style failure
-- ("Something went wrong") — discovered live in production via a real
-- first-time customer report, reproduced with
-- spin_history_prize_id_fkey: Key (prize_id)=(<first-time-prize-uuid>) is
-- not present in table "spin_prizes".
--
-- Both history tables already snapshot prize_type/prize_label/prize_value
-- inline specifically so history stays meaningful independent of the live
-- prize row (see migration 118's own comment: "snapshots the prize won so
-- history survives later prize edits/deletes") — prize_id was already
-- best-effort (ON DELETE SET NULL), never required for the row to make
-- sense. Dropping the constraint lets it hold an id from either the normal
-- or first-time pool without needing a second nullable FK column.
--
-- Fully additive in spirit: removes an overly-strict constraint only, no
-- data loss, no column changes.

ALTER TABLE spin_history DROP CONSTRAINT IF EXISTS spin_history_prize_id_fkey;
ALTER TABLE scratch_history DROP CONSTRAINT IF EXISTS scratch_history_prize_id_fkey;

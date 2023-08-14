-- dev

create or replace view dev_user_feeds as
     select * from dev_tbl_donations d
     left join 
      (
     SELECT u.domain_name as donator_username, u.wallet as donator_wallet, u.profile_metadata ->> 'avatar' as donator_avatar
     FROM dev_tbl_users u
 )a ON (a.donator_wallet = d.donator)

 -- prod

create or replace view user_feeds as
     select * from tbl_donations d
     left join 
      (
     SELECT u.domain_name as donator_username, u.wallet as donator_wallet, u.profile_metadata ->> 'avatar' as donator_avatar
     FROM tbl_users u
 )a ON (a.donator_wallet = d.donator)



-- dev
 
create or replace view
  public.dev_top_donations as
select
  d.donator,
  d.creator_id,
  donator_username,
  donator_wallet,
  donator_avatar,
  sum(d.amount) as total_amount,
  count(*) as count_donation
from
  dev_tbl_donations d

  left join 
      (
     SELECT u.domain_name as donator_username, u.wallet as donator_wallet, u.profile_metadata ->> 'avatar' as donator_avatar
     FROM dev_tbl_users u
 )a ON (a.donator_wallet = d.donator)

group by
  d.donator,
  d.creator_id,
  a.donator_username,
  a.donator_wallet,
  a.donator_avatar

  order by
  (sum(d.amount)) desc,
  d.donator,
  d.creator_id;

-- prod
create or replace view
  public.top_donations as
select
  d.donator,
  d.creator_id,
  donator_username,
  donator_wallet,
  donator_avatar,
  sum(d.amount) as total_amount,
  count(*) as count_donation
from
  tbl_donations d

  left join 
      (
     SELECT u.domain_name as donator_username, u.wallet as donator_wallet, u.profile_metadata ->> 'avatar' as donator_avatar
     FROM tbl_users u
 )a ON (a.donator_wallet = d.donator)

group by
  d.donator,
  d.creator_id,
  a.donator_username,
  a.donator_wallet,
  a.donator_avatar

  order by
  (sum(d.amount)) desc,
  d.donator,
  d.creator_id;  
 
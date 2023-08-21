use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default)]
pub struct Membership {
    pub profile: Pubkey,
    pub metadata_uri: String,
    pub name: String,
    pub price: u32,
    pub collection_address: Pubkey,
}

#[event]
pub struct MembershipCreated {
    pub asset_id: Pubkey,
    pub timestamp: i64,
    pub membership_id: String,
    pub profile: Pubkey,
    pub metadata_uri: String,
    pub name: String,
    pub price: u32,
    pub collection_address: Pubkey,
}

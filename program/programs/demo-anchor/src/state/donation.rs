use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default)]
pub struct Donation {
    pub donator: Pubkey,
    pub creator: String,
    pub amount: u32,
    pub metadata_uri: String,
}

#[event]
pub struct DonationCreated {
    pub asset_id: Pubkey,
    pub timestamp: i64,
    pub donation_id: String,
    pub donator: Pubkey,
    pub creator: String,
    pub amount: u32,
    pub metadata_uri: String,
}

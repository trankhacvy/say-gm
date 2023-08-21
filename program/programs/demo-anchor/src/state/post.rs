use anchor_lang::prelude::*;
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default)]
pub enum Audience {
    #[default]
    Public,
    Supporter,
    Membership,
}

// #[account]
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default)]
pub struct Post {
    pub profile: Pubkey,
    pub metadata_uri: String,
    pub comments: Option<Pubkey>,
    pub audience: Audience,
}

#[event]
pub struct PostCreated {
    pub asset_id: Pubkey,
    pub post_id: String,
    pub profile: Pubkey,
    pub metadata_uri: String,
    pub audience: Audience,
    pub timestamp: i64,
}

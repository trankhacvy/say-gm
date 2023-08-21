use anchor_lang::prelude::*;

use crate::constants::MAX_URI_LEN;

#[account]
pub struct Profile {
    pub authority: Pubkey,
    pub metadata_uri: String,
    pub username: String,
    pub merkle_tree: Pubkey,
    pub bump: u8,
}

impl Profile {
    pub const LEN: usize = 8 + MAX_URI_LEN + std::mem::size_of::<Self>();
}

use anchor_lang::{prelude::*, solana_program::keccak::hashv};
use borsh::{BorshDeserialize, BorshSerialize};
use spl_account_compression::Node;
use std::mem::size_of;

// Account to hold the compressed data in a tree
#[account]
pub struct TreeConfig {
    pub authority: Pubkey,
    pub merkle_tree: Pubkey,
}

impl TreeConfig {
    pub const LEN: usize = 8 + size_of::<Self>();
}

// Leaf Schema
#[derive(BorshSerialize, BorshDeserialize, Clone, Debug, Default)]
pub struct LeafSchema {
    pub asset_id: Pubkey,
    pub seed_hash: [u8; 32],
    pub data_hash: [u8; 32],
}

impl LeafSchema {
    pub fn to_node(&self) -> Result<Node> {
        let serialized = self.try_to_vec()?;
        msg!("Serialized leaf schema: {:?}", serialized);
        let node = hashv(&[&serialized]).to_bytes();
        Ok(node)
    }
}

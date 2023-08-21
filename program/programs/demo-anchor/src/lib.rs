use crate::intructions::*;
use crate::state::Audience;
use anchor_lang::prelude::*;

pub mod assertions;
pub mod constants;
pub mod errors;
pub mod intructions;
pub mod state;
pub mod utils;

declare_id!("EH9Nibp4mjdnTeU14aVV9q4xBmoRwcpZvqF93s9tFwRx");

#[program]
pub mod demo_anchor {

    use super::*;

    pub fn create_tree(
        ctx: Context<CreateTree>,
        max_depth: u32,
        max_buffer_size: u32,
    ) -> Result<()> {
        create_tree_handler(ctx, max_depth, max_buffer_size)
    }

    // profile
    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        metadata_uri: String,
    ) -> Result<()> {
        create_profile_handler(ctx, username, metadata_uri)
    }

    // memberships
    pub fn create_membership(
        ctx: Context<CreateMembership>,
        membership_id: String,
        metadata_uri: String,
        name: String,
        price: u32,
    ) -> Result<()> {
        create_membership_handler(ctx, membership_id, metadata_uri, name, price)
    }

    // create post
    pub fn create_post(
        ctx: Context<CreatePost>,
        post_id: String,
        metadata_uri: String,
        audience: Option<Audience>,
    ) -> Result<()> {
        create_post_handler(ctx, post_id, metadata_uri, audience)
    }
}

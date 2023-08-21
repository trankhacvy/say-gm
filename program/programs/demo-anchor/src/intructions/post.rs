use anchor_lang::{prelude::*, solana_program::keccak::hashv};
use spl_account_compression::{program::SplAccountCompression, wrap_application_data_v1, Noop};

use crate::{
    constants::PROFILE_PREFIX_SEED,
    state::{Audience, LeafSchema, Post, PostCreated, Profile},
    utils::{append_leaf, try_find_asset_id},
};

#[derive(Accounts)]
pub struct CreatePost<'info> {
    // merkle tree
    #[account(mut)]
    /// CHECK The account must have the same authority as that of the config
    pub merkle_tree: UncheckedAccount<'info>,
    // misc
    #[account(mut)]
    pub authority: Signer<'info>,

    // profile
    #[account(
        seeds = [
            PROFILE_PREFIX_SEED.as_bytes(),
            authority.key.as_ref(),
            profile.username.as_bytes(),
        ],
        bump,
        constraint = profile.authority == authority.key(),
        constraint = profile.merkle_tree == merkle_tree.key()
    )]
    pub profile: Account<'info, Profile>,

    // program
    pub compression_program: Program<'info, SplAccountCompression>,
    pub log_wrapper_program: Program<'info, Noop>,
    // pub gpl_core_program: Program<'info, GplCore>,
    pub system_program: Program<'info, System>,
}

pub fn create_post_handler(
    ctx: Context<CreatePost>,
    post_id: String,
    metadata_uri: String,
    audience: Option<Audience>,
) -> Result<()> {
    let audience = audience.unwrap_or(Audience::Public);

    let post = Post {
        profile: ctx.accounts.authority.key(),
        metadata_uri: metadata_uri.clone(),
        comments: None,
        audience: audience.clone(),
    };

    let seed_hash = hashv(&[post_id.as_bytes()]).to_bytes();

    let asset_id = try_find_asset_id(ctx.accounts.merkle_tree.key, seed_hash)?;

    let leaf = LeafSchema {
        asset_id,
        seed_hash: seed_hash,
        data_hash: hashv(&[&post.try_to_vec()?]).to_bytes(),
    };

    let leaf_node = leaf.to_node()?;

    wrap_application_data_v1(leaf_node.to_vec(), &ctx.accounts.log_wrapper_program)?;

    append_leaf(
        ctx.accounts.merkle_tree.key,
        ctx.accounts.profile.bump,
        &ctx.accounts.authority.to_account_info(),
        leaf_node,
        &ctx.accounts.merkle_tree.to_account_info(),
        &ctx.accounts.compression_program.to_account_info(),
        &ctx.accounts.log_wrapper_program.to_account_info(),
    )?;

    emit!(PostCreated {
        asset_id,
        post_id,
        profile: *ctx.accounts.profile.to_account_info().key,
        metadata_uri,
        audience,
        timestamp: Clock::get()?.unix_timestamp,
    });

    Ok(())
}

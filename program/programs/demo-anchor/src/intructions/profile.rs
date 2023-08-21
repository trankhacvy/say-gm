use crate::{
    assertions::assert_profile_valid,
    constants::PROFILE_PREFIX_SEED,
    state::{Profile, TreeConfig},
};
use anchor_lang::prelude::*;
use spl_account_compression::{program::SplAccountCompression, Noop};

#[derive(Accounts)]
#[instruction(username: String)]
pub struct CreateProfile<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub authority: Signer<'info>,
    #[account(
        init,
        seeds = [
            PROFILE_PREFIX_SEED.as_bytes(),
            authority.key.as_ref(),
            username.as_bytes(),
        ],
        bump,
        payer = payer,
        space = Profile::LEN
    )]
    pub profile: Account<'info, Profile>,
    // merkle tree
    #[account(
        init,
        seeds = [
            merkle_tree.to_account_info().key.as_ref()
            ],
        bump,
        payer = payer,
        space = TreeConfig::LEN
    )]
    pub tree_config: Account<'info, TreeConfig>,
    #[account(zero)]
    /// CHECK: This account must be all zeros
    pub merkle_tree: UncheckedAccount<'info>,
    // program
    pub system_program: Program<'info, System>,
    pub log_wrapper: Program<'info, Noop>,
    pub compression_program: Program<'info, SplAccountCompression>,
}

#[access_control(assert_profile_valid(&username, &metadata_uri))]
pub fn create_profile_handler(
    ctx: Context<CreateProfile>,
    username: String,
    metadata_uri: String,
) -> Result<()> {
    // init merkle tree
    let merkle_tree = ctx.accounts.merkle_tree.to_account_info();
    let merkle_tree_key = merkle_tree.key();

    let seeds = &[merkle_tree.key.as_ref(), &[ctx.bumps["tree_config"]]];
    let tree_config = &mut ctx.accounts.tree_config;
    tree_config.set_inner(TreeConfig {
        authority: ctx.accounts.authority.key(),
        merkle_tree: merkle_tree_key,
    });
    let authority_pda_signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.compression_program.to_account_info(),
        spl_account_compression::cpi::accounts::Initialize {
            authority: ctx.accounts.authority.to_account_info(),
            merkle_tree,
            noop: ctx.accounts.log_wrapper.to_account_info(),
        },
        authority_pda_signer,
    );

    spl_account_compression::cpi::init_empty_merkle_tree(cpi_ctx, 3, 8)?;

    let profile = &mut ctx.accounts.profile;

    profile.set_inner(Profile {
        authority: *ctx.accounts.authority.key,
        username,
        metadata_uri,
        merkle_tree: merkle_tree_key,
        bump: ctx.bumps["tree_config"],
    });

    Ok(())
}

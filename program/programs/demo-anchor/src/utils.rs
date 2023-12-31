use anchor_lang::prelude::*;
use spl_account_compression::Node;

use crate::errors::AppError;

pub fn try_find_asset_id(merkle_tree: &Pubkey, seed_hash: [u8; 32]) -> Result<Pubkey> {
    let asset_seeds = [b"asset".as_ref(), merkle_tree.as_ref(), seed_hash.as_ref()];
    match Pubkey::try_find_program_address(&asset_seeds, &crate::id()) {
        Some((asset_id, _)) => Ok(asset_id),
        None => Err(AppError::AssetIDNotFound.into()),
    }
}

pub fn replace_leaf<'info>(
    merkle_tree: &Pubkey,
    bump: u8,
    authority: &AccountInfo<'info>,
    merkle_tree_account: &AccountInfo<'info>,
    root_node: Node,
    previous_leaf: Node,
    new_leaf: Node,
    index: u32,
    remaining_accounts: &[AccountInfo<'info>],
    compression_program: &AccountInfo<'info>,
    log_wrapper: &AccountInfo<'info>,
) -> Result<()> {
    let seeds = &[merkle_tree.as_ref(), &[bump]];
    let authority_pda_signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        compression_program.clone(),
        spl_account_compression::cpi::accounts::Modify {
            authority: authority.clone(),
            merkle_tree: merkle_tree_account.clone(),
            noop: log_wrapper.clone(),
        },
        authority_pda_signer,
    )
    .with_remaining_accounts(remaining_accounts.to_vec());
    spl_account_compression::cpi::replace_leaf(cpi_ctx, root_node, previous_leaf, new_leaf, index)
}

pub fn append_leaf<'info>(
    merkle_tree: &Pubkey,
    bump: u8,
    authority: &AccountInfo<'info>,
    leaf_node: Node,
    merkle_tree_account: &AccountInfo<'info>,
    compression_program: &AccountInfo<'info>,
    log_wrapper: &AccountInfo<'info>,
) -> Result<()> {
    let seeds = &[merkle_tree.as_ref(), &[bump]];
    let authority_pda_signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        compression_program.clone(),
        spl_account_compression::cpi::accounts::Modify {
            authority: authority.clone(),
            merkle_tree: merkle_tree_account.clone(),
            noop: log_wrapper.clone(),
        },
        authority_pda_signer,
    );
    spl_account_compression::cpi::append(cpi_ctx, leaf_node)
}

pub fn verify_leaf<'info>(
    merkle_tree: &Pubkey,
    bump: u8,
    root_node: Node,
    leaf_node: Node,
    index: u32,
    remaining_accounts: &[AccountInfo<'info>],
    merkle_tree_account: &AccountInfo<'info>,
    compression_program: &AccountInfo<'info>,
) -> Result<()> {
    let seeds = &[merkle_tree.as_ref(), &[bump]];
    let authority_pda_signer = &[&seeds[..]];
    let cpi_ctx = CpiContext::new_with_signer(
        compression_program.clone(),
        spl_account_compression::cpi::accounts::VerifyLeaf {
            merkle_tree: merkle_tree_account.clone(),
        },
        authority_pda_signer,
    )
    .with_remaining_accounts(remaining_accounts.to_vec());
    spl_account_compression::cpi::verify_leaf(cpi_ctx, root_node, leaf_node, index)
}

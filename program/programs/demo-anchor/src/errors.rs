use anchor_lang::prelude::*;

#[error_code]
pub enum AppError {
    #[msg("Invalid authority provided")]
    AssetIDNotFound, 
    #[msg("Username is too long")]
    UsernameTooLong,
    #[msg("URI is too long")]
    URITooLong,
}

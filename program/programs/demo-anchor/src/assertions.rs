use anchor_lang::prelude::*;

use crate::{
    constants::{MAX_URI_LEN, MAX_USERNAME_LEN},
    errors::AppError,
};

pub fn assert_profile_valid(username: &str, uri: &str) -> Result<()> {
    if username.len() > MAX_USERNAME_LEN {
        return Err(AppError::UsernameTooLong.into());
    }

    if uri.len() > MAX_URI_LEN {
        return Err(AppError::URITooLong.into());
    }

    Ok(())
}

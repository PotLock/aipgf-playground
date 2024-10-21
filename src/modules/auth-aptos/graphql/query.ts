export const queryTokenBalance = `
query TokenInBalance($address: string) {
  current_fungible_asset_balances(
    where: {owner_address: {_eq: $address}}
  ) {
    owner_address
    amount
    storage_id
    last_transaction_version
    last_transaction_timestamp
    is_frozen
    metadata {
      asset_type
      creator_address
      decimals
      icon_uri
      name
      project_uri
      symbol
      token_standard
      maximum_v2
      supply_v2
    }
  }
}

`;

export const queryNFTInBalance = `
query NFTInBalance($address: String) {
  current_token_ownerships_v2(
    limit: 5
    offset: 0
    where: {
      owner_address: {
        _eq: $address
      }
    }
  ) {
    amount
    is_fungible_v2
    is_soulbound_v2
    last_transaction_timestamp
    non_transferrable_by_owner
    last_transaction_version
    owner_address
    property_version_v1
    storage_id
    table_type_v1
    token_data_id
    token_properties_mutated_v1
    token_standard
    current_token_data {
      collection_id
      token_name
      current_collection {
        creator_address
      }
    }
  }
}
`;

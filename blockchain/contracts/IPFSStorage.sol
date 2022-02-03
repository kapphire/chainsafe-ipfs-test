// SPDX-License-Identifier: MIT

pragma solidity 0.8.0;

contract IPFSStorage {
    struct Multihash {
        bytes32 digest;
        uint8 hash_function;
        uint8 size;
    }

    Multihash multihash;

    function setCID(bytes32 _hash, uint8 _hash_function, uint8 _size) public {
        Multihash memory hashIns;
        hashIns.digest = _hash;
        hashIns.hash_function = _hash_function;
        hashIns.size = _size;

        multihash = hashIns;
    }

    function getCID() public view returns(bytes32 digest, uint8 hashfunction, uint8 size) {
        return (multihash.digest, multihash.hash_function, multihash.size);
    }
}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3
from solcx import compile_source
from datetime import datetime
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

w3 = Web3(Web3.HTTPProvider("http://0.0.0.0:8545")) 
network_id = w3.net.version

all_contract_addresses = []

start_block = 0
current_block = w3.eth.block_number

with open("Voting.sol", "r") as file:
    voting_contract_code = file.read()

compiled_sol = compile_source(voting_contract_code, output_values=['abi', 'bin'])
contract_id, contract_interface = compiled_sol.popitem()

bytecode = contract_interface['bin']
abi = contract_interface['abi']

w3.eth.default_account = w3.eth.accounts[0]
Voting = w3.eth.contract(abi=abi, bytecode=bytecode)

tx_hash = Voting.constructor().transact()
tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)

voting = w3.eth.contract(
    address=tx_receipt.contractAddress,
    abi=abi
)

class NewVote(BaseModel):
    name: str
    options: list[str]
    date: str

class VotingInfo(BaseModel):
    name: str
    id: int

class VotingInfoStorage(BaseModel):
    votings: list[VotingInfo]

@app.post("/create")
def new_voting(new_vote: NewVote):
    date_obj = datetime.fromisoformat(new_vote.date)
    unix_time = int(date_obj.timestamp())
    
    tx_hash = voting.functions.createVoting(new_vote.name, new_vote.options, unix_time).transact()
    tx_receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(tx_receipt)
    return {"status": "success", "message": "New voting created for options:"}

@app.get("/list")
async def current_votings():
    voting_names, indexes = voting.functions.getAllVotingNames().call()
    votings_info = [VotingInfo(name=name, id=index) for name, index in zip(voting_names, indexes)]
    voting_info_storage = VotingInfoStorage(votings=votings_info)
    return voting_info_storage.dict()

@app.get("/get")
async def get_results(id:int):
    print(id)
    print(type(id))
    voting_info = voting.functions.getVotingInfo(id).call()
    name, candidate_list, end_time, votes = voting_info
    results = [{"candidate": candidate, "votes": vote} for candidate, vote in zip(candidate_list, votes)]
    return {
        "name": name,
        "end_time": end_time,
        "results": results
    }
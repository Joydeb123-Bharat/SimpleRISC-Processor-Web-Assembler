from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from assembler import run_assembler_from_text

app = FastAPI(title="SimpleRISC Web Assembler API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development, allow all. Change in prod.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AssembleRequest(BaseModel):
    code: str

class AssembleResponse(BaseModel):
    success: bool
    message: str
    data: List[Dict[str, Any]]
    symbol_table: Dict[str, int]
    raw_binary_list: List[str]

@app.post("/assemble", response_model=AssembleResponse)
async def assemble_code(req: AssembleRequest):
    try:
        success, message, data, symbol_table, raw_binary_list = run_assembler_from_text(req.code)
        return AssembleResponse(
            success=success,
            message=message,
            data=data,
            symbol_table=symbol_table,
            raw_binary_list=raw_binary_list
        )
    except Exception as e:
        return AssembleResponse(
            success=False,
            message=f"Internal Server Error: {str(e)}",
            data=[],
            symbol_table={},
            raw_binary_list=[]
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

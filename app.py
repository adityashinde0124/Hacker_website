import requests
import time
import sys
import argparse

def print_hacker_style(text, delay=0.03):
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

def simulate_exploit(target_ip):
    print_hacker_style(f"\n[!] TARGET LOCK ACQUIRED: {target_ip}")
    print_hacker_style("[!] INITIALIZING MITM ATTACK...")
    time.sleep(1)
    print_hacker_style("[+] Scanning network for unprotected wallets...")
    time.sleep(1.5)
    print_hacker_style("[+] Target Found: 0x1234...40")
    print_hacker_style("[+] Intercepting pending transaction...")
    time.sleep(1)
    print_hacker_style("[+] Swapping recipient address with MALICIOUS_VAULT...")
    
    # Trigger the detection in Sentinel-Node using the remote IP
    try:
        # Dynamic URL based on target_ip, default port 8000
        url = f"http://192.168.137.214:8000/attack/trigger"
        response = requests.post(url, timeout=5)
        
        if response.status_code == 200:
            print_hacker_style("\n[!] ERROR: TRANSACTION FAILED!")
            print_hacker_style("[!] REASON: MEV Front-Run detected. Target wallet is now EMPTY.")
            print_hacker_style("[!] STATUS: Attack Neutralized by Sentinel-Node Shield.")
        else:
            print_hacker_style(f"\n[?] Unexpected response code: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print_hacker_style(f"\n[-] CONNECTION FAILED! Cannot reach 10.151.55.111:8000.")
        print_hacker_style("[-] Make sure Sentinel-Node is running and accessible on the network.")
        print_hacker_style("[-] Also ensure the backend was started with host '0.0.0.0'.")
    except requests.exceptions.Timeout:
        print_hacker_style("\n[-] TIMEOUT! The target did not respond in time.")
    except Exception as e:
        print(f"\n[-] Unknown Error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sentinel-Node Remote Exploit Simulator")
    parser.add_argument("--target_ip", default="192.168.137.214", help="The IP address of the machine running Sentinel-Node (e.g., 10.151.55.111)")
    
    args = parser.parse_args()
    
    print_hacker_style("=== KALI EXPLOIT v2.1 - REMOTE TRANSACTION INTERCEPTOR ===")
    simulate_exploit(args.target_ip)
import socket
import re
from common_ports import ports_and_services as ref
from contextlib import closing


def get_open_ports(target, port_range, verbose=False):
  open_ports = []

  is_addr = re.match('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$', target)

  if is_addr:
    try:
      name = socket.gethostbyaddr(target)[0] + ' '
      addr = f'({target})'
    except socket.error:
      name = None
      addr = target
  else:
    name = target + ' '
    try:
      addr = f'({socket.gethostbyname(target)})'
    except:
      return 'Error: Invalid hostname'
    
  
  for port in range(port_range[0], int(port_range[1]) + 1):
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
      s.settimeout(1)
      try:
        conn = s.connect_ex((target, port))
        
        if conn == 0:
          open_ports.append(port)
          
      except:
        return 'Error: Invalid IP address'

  if verbose:
    title = f'Open ports for {(name or "") + addr}\n'
    headers = 'PORT     SERVICE\n'
    rows = '\n'.join([f'{i}{" " * (7 if i < 100 else 6)}{ref[i]}' for i in open_ports])
    return title + headers + rows
  else:
    return(open_ports)
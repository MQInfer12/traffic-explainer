from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import ipinfo
import socket

from secrets import IPINFO_TOKEN

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
  return jsonify({
    "message": "¡Hola mundo en Flask!",
    "data": "",
    "status": 200
  })

@app.route('/my_location')
def my_location():
  handler = ipinfo.getHandler(IPINFO_TOKEN)
  ip_address = request.headers.get('X-Forwarded-For', request.remote_addr)
  details = handler.getDetails(ip_address)
  try:
    print(f'Ciudad de origen: {details.city}')
  except AttributeError:
    return jsonify({
      "message": "IP Privada, no se puede extraer datos GPS",
      "data": "",
      "status": 500
    })
  else:
    data = {
      "pais": details.country_name,
      "ciudad": details.city,
      "latitud": details.latitude,
      "longitud": details.longitude,
    }
    return jsonify({
      "message": "Localidad obtenida correctamente",
      "data": data,
      "status": 200
    })

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=5000)
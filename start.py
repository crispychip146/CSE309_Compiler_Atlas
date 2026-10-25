#!/usr/bin/env python3
"""Serve the bundled Compiler Atlas on this computer; Python standard library only."""
import argparse
import functools
import http.server
import pathlib
import threading
import webbrowser

class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.mjs': 'text/javascript', '.js': 'text/javascript',
                      '.css': 'text/css', '.pdf': 'application/pdf',
                      '.json': 'application/json', '.md': 'text/markdown; charset=utf-8'}
    def log_message(self, format, *args):
        if args and str(args[1] if len(args)>1 else '') not in ('200','304'):
            super().log_message(format, *args)

def main():
    parser = argparse.ArgumentParser(description='Run your offline CSE 309 Compiler Atlas.')
    parser.add_argument('--port', type=int, default=8000, help='local port (default: 8000; 0 picks a free port)')
    parser.add_argument('--no-browser', action='store_true', help='print the address without opening a browser')
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error('port must be between 0 and 65535')
    website = pathlib.Path(__file__).resolve().parent / 'website'
    if not (website / 'index.html').is_file():
        parser.error('website/index.html is missing. Extract the entire ZIP before starting.')
    handler = functools.partial(Handler, directory=str(website))
    try:
        server = http.server.ThreadingHTTPServer(('127.0.0.1', args.port), handler)
    except OSError:
        if args.port == 0:
            raise
        server = http.server.ThreadingHTTPServer(('127.0.0.1', 0), handler)
    server.daemon_threads = True
    url = f'http://127.0.0.1:{server.server_address[1]}/'
    print('\nCSE 309 - Compiler Study Atlas', flush=True)
    print(url, flush=True)
    print('Keep this terminal open. Press Ctrl+C to stop.\n', flush=True)
    if not args.no_browser:
        opener = threading.Timer(0.5, webbrowser.open, args=(url,))
        opener.daemon = True
        opener.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')
    finally:
        server.server_close()

if __name__ == '__main__':
    main()

"use client";
import { useState, useMemo } from "react";

export default function HtaccessGenerator() {
  const [httpsRedirect, setHttpsRedirect] = useState(true);
  const [wwwMode, setWwwMode] = useState<"none" | "www-to-non" | "non-to-www">("www-to-non");
  const [custom404, setCustom404] = useState(false);
  const [custom404Page, setCustom404Page] = useState("/404.html");
  const [blockIps, setBlockIps] = useState(false);
  const [blockedIps, setBlockedIps] = useState("192.168.1.1\n10.0.0.1");
  const [gzip, setGzip] = useState(true);
  const [cacheHeaders, setCacheHeaders] = useState(true);
  const [cacheDays, setCacheDays] = useState("30");
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [htpasswdPath, setHtpasswdPath] = useState("/home/user/.htpasswd");
  const [blockHotlinking, setBlockHotlinking] = useState(false);
  const [hotlinkDomain, setHotlinkDomain] = useState("example.com");
  const [copied, setCopied] = useState(false);

  const code = useMemo(() => {
    const parts: string[] = [];

    if (httpsRedirect) {
      parts.push(`# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`);
    }

    if (wwwMode === "www-to-non") {
      parts.push(`# Redirect www to non-www
RewriteEngine On
RewriteCond %{HTTP_HOST} ^www\\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]`);
    } else if (wwwMode === "non-to-www") {
      parts.push(`# Redirect non-www to www
RewriteEngine On
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^(.*)$ https://www.%{HTTP_HOST}/$1 [R=301,L]`);
    }

    if (custom404) {
      parts.push(`# Custom Error Pages
ErrorDocument 404 ${custom404Page}
ErrorDocument 403 /403.html
ErrorDocument 500 /500.html`);
    }

    if (blockIps) {
      const ips = blockedIps.split("\n").map(ip => ip.trim()).filter(Boolean);
      if (ips.length > 0) {
        parts.push(`# Block IP Addresses
<RequireAll>
  Require all granted
${ips.map(ip => `  Require not ip ${ip}`).join("\n")}
</RequireAll>`);
      }
    }

    if (gzip) {
      parts.push(`# Enable GZIP Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml
  AddOutputFilterByType DEFLATE text/css text/javascript
  AddOutputFilterByType DEFLATE application/javascript application/json
  AddOutputFilterByType DEFLATE application/xml application/xhtml+xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>`);
    }

    if (cacheHeaders) {
      const seconds = parseInt(cacheDays) * 86400;
      parts.push(`# Set Cache Headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus ${cacheDays} days"
  ExpiresByType image/png "access plus ${cacheDays} days"
  ExpiresByType image/gif "access plus ${cacheDays} days"
  ExpiresByType image/svg+xml "access plus ${cacheDays} days"
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType text/html "access plus 1 hour"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(ico|jpe?g|png|gif|svg|webp|css|js|woff2?)$">
    Header set Cache-Control "max-age=${seconds}, public"
  </FilesMatch>
</IfModule>`);
    }

    if (passwordProtect) {
      parts.push(`# Password Protect Directory
AuthType Basic
AuthName "Restricted Area"
AuthUserFile ${htpasswdPath}
Require valid-user`);
    }

    if (blockHotlinking) {
      parts.push(`# Block Hotlinking
RewriteEngine On
RewriteCond %{HTTP_REFERER} !^$
RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?${hotlinkDomain.replace(/\./g, "\\.")}/ [NC]
RewriteRule \\.(jpg|jpeg|png|gif|svg|webp)$ - [F,NC,L]`);
    }

    return parts.join("\n\n");
  }, [httpsRedirect, wwwMode, custom404, custom404Page, blockIps, blockedIps, gzip, cacheHeaders, cacheDays, passwordProtect, htpasswdPath, blockHotlinking, hotlinkDomain]);

  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const Toggle = ({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
      <label className="relative inline-flex items-center cursor-pointer mt-0.5">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
      <div>
        <div className="text-sm font-semibold text-gray-700">{label}</div>
        <div className="text-xs text-gray-500">{desc}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <Toggle label="Force HTTPS" desc="Redirect all HTTP traffic to HTTPS" checked={httpsRedirect} onChange={setHttpsRedirect} />

        <div className="p-3">
          <label className="text-sm font-semibold text-gray-700 block mb-1">WWW Redirect</label>
          <select value={wwwMode} onChange={e => setWwwMode(e.target.value as "none" | "www-to-non" | "non-to-www")} className="calc-input !py-1.5 text-sm">
            <option value="none">No redirect</option>
            <option value="www-to-non">www to non-www</option>
            <option value="non-to-www">non-www to www</option>
          </select>
        </div>

        <Toggle label="Custom 404 Page" desc="Set custom error pages" checked={custom404} onChange={setCustom404} />
        {custom404 && (
          <div className="ml-12">
            <input value={custom404Page} onChange={e => setCustom404Page(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="/404.html" />
          </div>
        )}

        <Toggle label="Block IP Addresses" desc="Block specific IPs from accessing your site" checked={blockIps} onChange={setBlockIps} />
        {blockIps && (
          <div className="ml-12">
            <textarea value={blockedIps} onChange={e => setBlockedIps(e.target.value)} className="calc-input text-sm font-mono" rows={3} placeholder="One IP per line" />
          </div>
        )}

        <Toggle label="Enable GZIP Compression" desc="Compress text-based files for faster loading" checked={gzip} onChange={setGzip} />
        <Toggle label="Set Cache Headers" desc="Browser caching for static assets" checked={cacheHeaders} onChange={setCacheHeaders} />
        {cacheHeaders && (
          <div className="ml-12">
            <label className="text-xs text-gray-600">Cache days for images:</label>
            <input type="number" value={cacheDays} onChange={e => setCacheDays(e.target.value)} className="calc-input !py-1 text-sm w-24 ml-2 inline-block" />
          </div>
        )}

        <Toggle label="Password Protect Directory" desc="Require username/password for access" checked={passwordProtect} onChange={setPasswordProtect} />
        {passwordProtect && (
          <div className="ml-12">
            <input value={htpasswdPath} onChange={e => setHtpasswdPath(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="Path to .htpasswd file" />
          </div>
        )}

        <Toggle label="Block Hotlinking" desc="Prevent other sites from embedding your images" checked={blockHotlinking} onChange={setBlockHotlinking} />
        {blockHotlinking && (
          <div className="ml-12">
            <input value={hotlinkDomain} onChange={e => setHotlinkDomain(e.target.value)} className="calc-input !py-1.5 text-sm" placeholder="yourdomain.com" />
          </div>
        )}
      </div>

      {/* Output */}
      {code && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">.htaccess Code</label>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="result-card font-mono text-xs whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{code}</pre>
        </div>
      )}
    </div>
  );
}

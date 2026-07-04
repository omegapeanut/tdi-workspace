"use client";

import { useEffect, useRef, useState } from "react";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { withBasePath } from "@/lib/basePath";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export default function MediaSection({ showToast }) {
  const [local, setLocal] = useState(null);
  const [uploaded, setUploaded] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    fetch(withBasePath("/media-manifest.json"))
      .then((r) => r.json())
      .then(setLocal)
      .catch(() => setLocal([]));
    getDocs(collection(db, "media")).then((snap) => setUploaded(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !cloudinaryConfigured) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!data.secure_url) throw new Error(data.error?.message || "Upload failed");
      const docData = { name: file.name, path: data.secure_url, publicId: data.public_id, source: "cloudinary", uploadedAt: serverTimestamp() };
      const ref = await addDoc(collection(db, "media"), docData);
      setUploaded((prev) => [...prev, { id: ref.id, ...docData }]);
      showToast("Uploaded to Cloudinary");
    } catch (err) {
      showToast(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  if (!local) {
    return <div style={{ padding: "24px clamp(16px, 4vw, 40px)" }}>Loading…</div>;
  }

  return (
    <div style={{ padding: "24px clamp(16px, 4vw, 40px)", display: "flex", flexDirection: "column", gap: "16px" }}>
      <div
        onClick={() => cloudinaryConfigured && fileRef.current?.click()}
        style={{
          border: "2px dashed rgba(34,28,21,.25)",
          borderRadius: "4px",
          padding: "34px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          background: "#FBF8F2",
          cursor: cloudinaryConfigured ? "pointer" : "default",
        }}
      >
        <span style={{ font: "600 13px Manrope, sans-serif" }}>{uploading ? "Uploading…" : cloudinaryConfigured ? "Click to upload a new image" : "Cloudinary isn't configured"}</span>
        <span style={{ font: "400 12px Manrope, sans-serif", color: "#8A8172", textAlign: "center" }}>
          {cloudinaryConfigured
            ? "Uploads go to Cloudinary and appear below."
            : "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to enable uploads. Today the site serves images from /public/images — the list below reflects what's actually shipped."}
        </span>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: "none" }} />
      </div>

      {uploaded.length > 0 && (
        <>
          <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" }}>UPLOADED ({uploaded.length})</span>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px" }}>
            {uploaded.map((f) => (
              <div key={f.id} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.path} alt={f.name} style={{ height: "90px", width: "100%", objectFit: "cover", borderRadius: "3px", border: "1px solid rgba(34,28,21,.1)" }} />
                <span style={{ font: "500 10px Manrope, sans-serif", color: "#5C5546", wordBreak: "break-all" }}>{f.name}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <span style={{ font: "600 11px Manrope, sans-serif", letterSpacing: ".18em", color: "#8A8172" }}>SHIPPED WITH THE SITE ({local.length})</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px" }}>
        {local.map((f) => (
          <div key={f.name} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={withBasePath(f.path)} alt={f.name} style={{ height: "90px", width: "100%", objectFit: "cover", borderRadius: "3px", border: "1px solid rgba(34,28,21,.1)" }} />
            <span style={{ font: "500 10px Manrope, sans-serif", color: "#5C5546", wordBreak: "break-all" }}>{f.name}</span>
          </div>
        ))}
      </div>
      <span style={{ font: "400 12px Manrope, sans-serif", color: "#A89C88" }}>
        To replace one of these, swap the file in public/images (keeping the same name) and redeploy — every page referencing it updates automatically.
      </span>
    </div>
  );
}

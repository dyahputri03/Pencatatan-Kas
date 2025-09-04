import { useState } from "react";
export const useModalConfirm = () => { const [open,setOpen]=useState(false); const ask=(fn)=>{ if(window.confirm("Yakin?")) fn?.(); }; return { open, ask }; };
export const useUploads = () => { const upload = async (file)=>({ link: URL.createObjectURL(file) }); return { upload }; };
"use client";

import { signOut } from "next-auth/react";

export function SignOutBtn() {
    return <button onClick={() => signOut()}> SignOut</button>;
}

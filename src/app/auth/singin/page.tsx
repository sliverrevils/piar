// src/app/auth/signin/page.tsx
"use client";

import { signIn } from "next-auth/react";

export default function SignInPage() {
    return (
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto", textAlign: "center" }}>
            <h1>Вход</h1>
            <button onClick={() => signIn("google")} style={{ marginBottom: "10px" }}>
                Войти через Google
            </button>
            <br />
            <button onClick={() => signIn("yandex")} style={{ marginBottom: "10px" }}>
                Войти через Yandex
            </button>
            <br />
            <button onClick={() => signIn("vk")} style={{ marginBottom: "10px" }}>
                Войти через VK
            </button>
            <br />
            <button onClick={() => signIn("mailru")} style={{ marginBottom: "10px" }}>
                Войти через Mail.ru
            </button>
            <hr />
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const email = (form.email as HTMLInputElement).value;
                    const password = (form.password as HTMLInputElement).value;

                    const result = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });

                    if (result?.error) {
                        alert("Ошибка: " + result.error);
                    } else {
                        alert("Успешный вход");
                    }
                }}
            >
                <h2>Войти с логином и паролем</h2>
                <input type="email" name="email" placeholder="Email" required style={{ marginBottom: "10px", display: "block" }} />
                <input type="password" name="password" placeholder="Пароль" required style={{ marginBottom: "10px", display: "block" }} />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

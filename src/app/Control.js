"use client"
import Link from "next/link"
import { useParams } from "next/navigation"

export function Control() {
    const params = useParams();
    const id = params.id;
    return (
        <ul>
            <li>
                <Link href="/create">Create</Link>
            </li>
            {id ? <>
                <li><Link href={"/update/" + id}>Update</Link></li>
                <li>
                    <button onClick={async () => {
                        const resp = await fetch(`http://localhost:3001/topics/${id}`, {
                            method: 'DELETE'
                        });
                        await resp.json();
                        Router.push('/');
                        Router.refresh();
                    }}>Delete</button>
                </li>
            </> : null}
        </ul>
    );
    <font face="Nanum Gothic, sans-serif"><span style="font-size: 10.89px; white-space: normal;">
    </span></font>
}
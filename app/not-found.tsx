import Link from "next/link"


export default function NotFoundPage(){

    return (
        <div className="flex flex-col space-y-5 justify-center items-center h-screen">
            <h1 className="text-3xl font-bold uppercase">Erreur: 404</h1>
            <p>La page que vous cherchez n'est pas disponible <br /> pour le moment.</p>
            <Link href={"/"} className="bg-green-700 p-2 rounded text-white px-3 py-2 hover:bg-green-600 transition">
                Retour
            </Link>
        </div>
    )
}
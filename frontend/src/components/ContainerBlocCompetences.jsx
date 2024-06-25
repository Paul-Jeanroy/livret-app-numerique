


export default function ContainerBlocCompetences({ data }) {

    return (
        <>
            {data.length > 0 && (
                <div className="bloc-competences">
                    {data.map((bloccompetence, index) => (
                        <div key={index}>{bloccompetence.libelle}</div>
                    ))}
                </div>
            )}
        </>
    )
}
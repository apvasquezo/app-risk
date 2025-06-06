
import ControlSuggestionModal from "@/components/views/ControlSuggestionModal"

export default function Home() {
  return (
    <main >
      <ControlSuggestionModal
        open={true}
        onClose={() => console.log('cerrar')}
        loading={false}
        field1="Fraude interno"
        field2="Mala praxis"
        field3="Tesorería"
        field4="Correo electrónico"
        field5="Transferencias no autorizadas"/>
    </main>
  )
}

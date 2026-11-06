
export default function PoliticaTratamientoDatos() {
  const secciones = [
    {
      titulo: "1. Identificación del responsable del tratamiento",
      contenido: (
        <>
          <p>El responsable del tratamiento de los datos personales es:</p>
          <ul>
            <li><strong>Razón social:</strong> CENTRO DE INVESTIGACIÓN EN CIBERSEGURIDAD EDUCATIVA S.A.S.</li>
            <li><strong>NIT:</strong> 902.049.123-1</li>
            <li><strong>Domicilio:</strong> Bogotá D.C., Colombia.</li>
            <li><strong>Dirección principal:</strong> Calle 4 D No. 53 F - 02, Bogotá D.C.</li>
            <li><strong>Correo electrónico:</strong> director.cice@gmail.com</li>
            <li><strong>Correo adicional para asuntos de privacidad:</strong> contacto@my-cice.com</li>
            <li><strong>Teléfono:</strong> 317 599 9993</li>
          </ul>
          <p>Para efectos de esta política, la sociedad podrá denominarse CICE.</p>
        </>
      ),
    },
    {
      titulo: "2. Marco normativo",
      contenido: (
        <p>Esta política se establece de conformidad con el artículo 15 de la Constitución Política de Colombia, la Ley Estatutaria 1581 de 2012, el Decreto 1074 de 2015 y las demás disposiciones que los modifiquen, complementen o sustituyan.</p>
      ),
    },
    {
      titulo: "3. Alcance",
      contenido: (
        <p>Esta política aplica al tratamiento de datos personales de las personas que se relacionen con la sociedad mediante su sitio web, formularios de contacto, correo electrónico, redes sociales, actividades académicas, proyectos, investigaciones, eventos, alianzas y demás canales institucionales. Comprende a clientes, usuarios, representantes de instituciones educativas, aliados, proveedores, participantes en actividades y demás personas cuyos datos sean recolectados en el desarrollo de las actividades de la sociedad.</p>
      ),
    },
    {
      titulo: "4. Datos personales objeto de tratamiento",
      contenido: (
        <>
          <p>De acuerdo con la actividad y la finalidad correspondiente, CICE podrá recolectar:</p>
          <ul>
            <li><strong>Datos de identificación:</strong> nombres y apellidos.</li>
            <li><strong>Datos de contacto:</strong> correo electrónico, teléfono y dirección, cuando resulte necesaria.</li>
            <li><strong>Datos profesionales e institucionales:</strong> organización, cargo y entidad a la que pertenece.</li>
            <li><strong>Información de comunicaciones:</strong> solicitudes, comentarios, propuestas y mensajes suministrados voluntariamente.</li>
            <li><strong>Datos técnicos:</strong> información de navegación y uso del sitio web, cuando sea recolectada mediante herramientas tecnológicas.</li>
          </ul>
          <p>CICE procurará recolectar únicamente los datos pertinentes, adecuados y necesarios para las finalidades informadas.</p>
          <p>No se solicitarán datos sensibles a través del formulario general de contacto.</p>
        </>
      ),
    },
    {
      titulo: "5. Finalidades del tratamiento",
      contenido: (
        <>
          <p>Los datos personales podrán ser tratados para las siguientes finalidades:</p>
          <ol>
            <li>Recibir, registrar y atender solicitudes, preguntas, comentarios y comunicaciones.</li>
            <li>Establecer contacto con personas, instituciones educativas, organizaciones y entidades interesadas en las actividades de CICE.</li>
            <li>Gestionar propuestas de colaboración, alianzas, proyectos y actividades institucionales.</li>
            <li>Informar sobre programas, servicios, eventos, actividades de formación e iniciativas de CICE, cuando exista la autorización correspondiente.</li>
            <li>Gestionar la participación en actividades académicas, investigativas, educativas y de innovación.</li>
            <li>Mantener registros administrativos y documentales de las relaciones institucionales.</li>
            <li>Gestionar consultas y reclamos relacionados con la protección de datos personales.</li>
            <li>Cumplir obligaciones legales, contractuales y administrativas aplicables.</li>
            <li>Gestionar la seguridad, funcionamiento y mejora de los canales digitales institucionales.</li>
          </ol>
          <p>El envío de información promocional o comercial que no sea necesaria para atender una solicitud estará sujeto a la autorización correspondiente y podrá ser rechazado o revocado por el titular.</p>
        </>
      ),
    },
    {
      titulo: "6. Derechos de los titulares",
      contenido: (
        <>
          <p>Los titulares de los datos personales tienen derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar sus datos personales.</li>
            <li>Solicitar prueba de la autorización otorgada, cuando esta sea exigible.</li>
            <li>Conocer las finalidades y el uso que se ha dado a sus datos.</li>
            <li>Presentar consultas y reclamos relacionados con el tratamiento.</li>
            <li>Solicitar la revocatoria de la autorización y/o la supresión de sus datos cuando proceda legalmente.</li>
            <li>Acceder gratuitamente a sus datos personales objeto de tratamiento.</li>
            <li>Presentar quejas ante la Superintendencia de Industria y Comercio, una vez agotado el trámite de consulta o reclamo ante el responsable o encargado, según corresponda.</li>
          </ul>
        </>
      ),
    },
    {
      titulo: "7. Autorización para el tratamiento",
      contenido: (
        <p>CICE solicitará autorización previa, expresa e informada cuando sea legalmente exigible. La autorización podrá obtenerse por medios físicos o electrónicos que permitan conservar evidencia de su otorgamiento. En los formularios digitales se informará al titular sobre las finalidades del tratamiento y se dispondrá de un mecanismo para manifestar su autorización. La sociedad conservará evidencia de las autorizaciones recibidas, incluyendo, cuando corresponda, la fecha, el medio de obtención y la versión de la política o aviso aplicable. La autorización para recibir comunicaciones comerciales o promocionales se solicitará de manera diferenciada cuando corresponda.</p>
      ),
    },
    {
      titulo: "8. Tratamiento de datos de niños, niñas y adolescentes",
      contenido: (
        <p>Por la naturaleza de las actividades de CICE en el ámbito educativo y de la ciberseguridad, la sociedad reconoce la especial protección que corresponde a los datos personales de niños, niñas y adolescentes. Su tratamiento se realizará únicamente cuando se cumplan los requisitos constitucionales y legales aplicables, atendiendo el interés superior del menor y el respeto de sus derechos fundamentales. Cuando corresponda, se contará con la autorización de su representante legal, garantizando previamente el derecho del menor a ser escuchado y considerando su madurez, autonomía y capacidad de comprensión. Los formularios generales de contacto de CICE no estarán destinados a recolectar datos personales de menores de edad. Los proyectos o actividades que requieran tratar dichos datos deberán contar con procedimientos y garantías específicas.</p>
      ),
    },
    {
      titulo: "9. Procedimiento para consultas y reclamos",
      contenido: (
        <>
          <p>Los titulares o sus representantes podrán presentar consultas y reclamos relacionados con sus datos personales mediante los siguientes canales:</p>
          <ul>
            <li><strong>Correo electrónico:</strong> director.cice@gmail.com</li>
            <li><strong>Correo adicional:</strong> contacto@my-cice.com</li>
            <li><strong>Dirección física:</strong> Calle 4 D No. 53 F - 02, Bogotá D.C.</li>
            <li><strong>Teléfono:</strong> 317 599 9993.</li>
          </ul>
          <p>Las solicitudes deberán permitir identificar al titular o a su representante y describir claramente la petición.</p>
          <p>CICE atenderá las consultas y reclamos dentro de los términos y condiciones establecidos en la legislación colombiana vigente.</p>
          <p>Cuando una solicitud esté incompleta o no reúna los requisitos legales, se solicitará la información necesaria para su trámite.</p>
        </>
      ),
    },
    {
      titulo: "10. Seguridad de la información",
      contenido: (
        <p>CICE adoptará medidas técnicas, humanas y administrativas razonables para proteger los datos personales contra pérdida, adulteración, acceso, uso o consulta no autorizados. El acceso a los datos estará limitado a las personas que requieran conocerlos para cumplir las finalidades autorizadas. La sociedad procurará que los proveedores tecnológicos que intervengan en el tratamiento mantengan condiciones adecuadas de seguridad y confidencialidad.</p>
      ),
    },
    {
      titulo: "11. Proveedores tecnológicos y tratamiento por terceros",
      contenido: (
        <p>Para desarrollar sus actividades, CICE podrá utilizar proveedores tecnológicos de alojamiento, infraestructura, almacenamiento de información, formularios, correo electrónico y servicios digitales. Cuando estos proveedores intervengan en el tratamiento de datos personales, su participación deberá ajustarse a las obligaciones legales aplicables, las finalidades autorizadas y las medidas de seguridad correspondientes. Cuando exista transmisión o transferencia internacional de datos personales, CICE observará las disposiciones legales aplicables y adoptará las medidas contractuales y de protección que correspondan.</p>
      ),
    },
    {
      titulo: "12. Conservación de los datos personales",
      contenido: (
        <p>Los datos personales serán conservados durante el tiempo necesario para cumplir las finalidades autorizadas, atender obligaciones legales o contractuales y mantener los registros que deban preservarse conforme a la legislación aplicable. Una vez cumplidas las finalidades y cuando no exista obligación legal o contractual de conservación, se procederá a su supresión o anonimización, según corresponda.</p>
      ),
    },
    {
      titulo: "13. Modificaciones de la política",
      contenido: (
        <p>CICE podrá actualizar esta política cuando existan cambios normativos, institucionales, tecnológicos o relacionados con las finalidades del tratamiento. Las modificaciones sustanciales serán comunicadas a través de los canales institucionales correspondientes. Cuando los cambios impliquen nuevas finalidades que requieran autorización, esta será solicitada conforme a la legislación vigente.</p>
      ),
    },
    {
      titulo: "14. Vigencia",
      contenido: (
        <p>La presente política entra en vigencia a partir del 5 de noviembre de 2026.</p>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 py-14 px-5">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10">
          <p className="text-blue-800 font-semibold tracking-widest text-sm uppercase mb-3">
            CICE · Centro de Investigación en Ciberseguridad Educativa
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Política de Tratamiento de Datos Personales
          </h1>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
            <span className="bg-white shadow-sm rounded-full px-4 py-2">Versión 1.0</span>
            <span className="bg-white shadow-sm rounded-full px-4 py-2">5 de noviembre de 2026</span>
          </div>
        </header>

        <section className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 md:p-10">
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-blue-950 mb-3">
              CENTRO DE INVESTIGACIÓN EN CIBERSEGURIDAD EDUCATIVA S.A.S.
            </h2>
            <p className="text-gray-700"><strong>Nombre abreviado:</strong> CICE</p>
            <p className="text-gray-700"><strong>NIT:</strong> 902.049.123-1</p>
            <p className="text-gray-700"><strong>Domicilio:</strong> Bogotá D.C., Colombia.</p>
            <p className="text-gray-700"><strong>Dirección:</strong> Calle 4 D No. 53 F - 02, Bogotá D.C.</p>
            <p className="text-gray-700"><strong>Teléfono:</strong> 317 599 9993</p>
            <p className="text-gray-700"><strong>Correo:</strong> director.cice@gmail.com</p>
            <p className="text-gray-700"><strong>Correo para asuntos de privacidad:</strong> contacto@my-cice.com</p>
          </div>

          <div className="space-y-8 text-gray-700 leading-7">
            {secciones.map((seccion) => (
              <section key={seccion.titulo}>
                <h2 className="text-lg md:text-xl font-bold text-blue-900 mb-3">
                  {seccion.titulo}
                </h2>
                <div className="space-y-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-2">
                  {seccion.contenido}
                </div>
              </section>
            ))}
          </div>

          <footer className="mt-10 pt-6 border-t border-gray-200 text-sm text-gray-600">
            <p className="font-semibold text-blue-950">
              CENTRO DE INVESTIGACIÓN EN CIBERSEGURIDAD EDUCATIVA S.A.S.
            </p>
            <p>NIT 902.049.123-1 · Bogotá D.C., Colombia</p>
            <p>Correo: director.cice@gmail.com</p>
            <p>Correo de privacidad: contacto@my-cice.com</p>
            <p>Teléfono: 317 599 9993</p>
            <p className="mt-4">Versión 1.0 · Entrada en vigencia: 5 de noviembre de 2026.</p>
          </footer>
        </section>

        <div className="text-center mt-8">
          <a href="/" className="inline-flex items-center text-blue-800 font-semibold hover:text-blue-600 transition">
            ← Volver al inicio
          </a>
        </div>
      </div>
    </main>
  );
}


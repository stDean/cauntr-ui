"use client";

import { Logout } from "@/actions/auth.a";
import { GetUser } from "@/actions/users.s";
import { useAppDispatch } from "@/app/redux";
import { Button } from "@/components/ui/button";
import { useReduxState } from "@/hooks/useRedux";
import { SET_EMAIL, SET_LOGGED_IN_USER, SET_TOKEN } from "@/state";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { token } = useReduxState();
  const dispatch = useAppDispatch();

  const fetchUser = async () => {
    const { success, error } = await GetUser({ token });

    if (error) {
      return;
    }

    dispatch(SET_LOGGED_IN_USER(success.data));
    console.log({ success });
  };

  useEffect(() => {
    fetchUser();
  }, [token]);

  const logOut = async () => {
    await Logout();
    router.push("/");

    dispatch(SET_LOGGED_IN_USER(null));
    dispatch(SET_EMAIL(""));
    dispatch(SET_TOKEN(""));
  };

  return (
    <div className="flex items-center justify-center px-4 overflow-y-scroll mb-4">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Adipisci
        nesciunt quae hic, in repellendus repudiandae molestias harum nisi
        cumque, eos labore maxime animi iste corrupti voluptas, voluptatem ad
        reprehenderit expedita quod sint ullam. Delectus modi corrupti unde
        tempore consequatur similique natus, cupiditate molestias recusandae.
        Molestiae aperiam voluptatem, quas totam odio quia cumque rem
        accusantium, nesciunt, quasi pariatur perferendis in amet explicabo. Ut
        laboriosam recusandae aspernatur quod, magni consequuntur ea cumque
        tenetur nesciunt unde a? Quis minima iure cumque hic autem eius facilis
        accusantium. Nobis fugiat, rem repellendus autem corporis, nam suscipit
        provident fugit quos excepturi sapiente impedit labore! Iure id quas
        fugit ab eaque. Odio corporis, accusamus molestias id est soluta ad
        nihil officia, tenetur officiis repellat unde aliquam quos doloremque
        dolorem doloribus fuga excepturi consectetur. Distinctio, labore fugit
        architecto mollitia porro commodi nostrum accusamus. Fuga quos debitis
        magnam, id nulla animi delectus! Odio accusamus id quos natus, nobis
        provident. Incidunt pariatur sint amet tempora quo sequi fuga earum,
        impedit eos ex eius porro quidem et reiciendis, blanditiis vitae illo
        architecto. Quae magni non itaque iusto dolorum ut aut aperiam odit
        ipsam asperiores repudiandae, sed mollitia possimus nemo nam deleniti
        autem ducimus, accusamus velit. Impedit, incidunt a! Labore, corporis,
        dolorem aut nostrum ut voluptatibus obcaecati dicta aliquam fuga quam
        nulla eveniet accusamus in debitis doloribus, quis fugiat?
        Exercitationem placeat odio obcaecati ipsa assumenda minima eveniet
        laborum cumque eos sed, eius blanditiis consequuntur deleniti optio
        officia, vitae quo beatae! Repellendus neque labore tempore porro odio
        rerum obcaecati architecto, enim eveniet maiores! Quo, provident minus!
        Voluptatum accusantium ex ratione. Magni, quia et, voluptatibus
        repudiandae cum possimus nihil quis suscipit non mollitia accusamus
        corrupti. Obcaecati quidem quae quis asperiores, rerum nostrum corporis
        architecto doloribus velit natus dignissimos nihil illo consequatur vel
        aut quasi accusantium. Perspiciatis commodi alias autem perferendis
        cumque quis, quasi, veniam earum deleniti assumenda architecto aperiam
        et cum, exercitationem ullam ducimus eligendi fugiat nam error laborum
        tempore dolore libero adipisci! Error quo rem quia facilis repellendus
        enim qui laboriosam aperiam dignissimos, corporis, sequi ratione dolorum
        debitis. Qui assumenda rerum dolor reiciendis at tempore distinctio eius
        impedit magni ab error, voluptas iste aliquam atque, repellat nobis
        fugit ullam temporibus, corporis delectus maxime? Dicta doloremque nam
        praesentium voluptatem suscipit at odio quos laborum maiores voluptates
        voluptatibus, ratione, atque ut id nihil quidem? Et exercitationem
        voluptate eos sed blanditiis, enim accusantium suscipit assumenda sit
        esse, porro, eligendi explicabo corporis molestiae tempore culpa
        voluptates animi iusto laudantium corrupti vero sequi sint quasi
        pariatur! Eius amet aperiam, corporis excepturi libero similique
        voluptates, veniam fugit unde saepe quod quidem ipsam dolor
        necessitatibus veritatis! Nostrum doloribus recusandae tempora atque.
        Recusandae aliquam excepturi tenetur voluptatum vel, minus at quam iusto
        alias non, vitae illum nulla, facere corrupti perspiciatis debitis
        doloribus temporibus sunt aut rerum eligendi odit dolorem sequi placeat.
        Molestias, dicta at sapiente maiores minus distinctio culpa provident
        doloremque. Adipisci culpa ea quae recusandae, nihil itaque ullam
        corporis? Temporibus ex necessitatibus sit, suscipit ea id beatae quia
        cumque neque et maxime amet dolorem, sapiente, enim mollitia itaque
        explicabo labore fugiat asperiores vitae molestias. Odio, ipsum,
        delectus dicta a eos corporis doloremque, numquam debitis consequuntur
        nostrum quis aspernatur excepturi? Quisquam illo ad rerum cumque nam
        atque, sequi veniam officia quis cupiditate enim voluptatibus esse
        ratione, dolores mollitia quam modi obcaecati iusto blanditiis! Quae,
        qui aspernatur! Reprehenderit ea nisi iure! Quibusdam, a accusantium
        debitis atque dolor veniam dolore perspiciatis rem, aperiam molestias
        dicta nam voluptate obcaecati mollitia asperiores consequatur natus!
        Suscipit vitae quia ea dolores corrupti laudantium, repellat reiciendis
        sequi! Velit totam laborum dicta modi dolore. Sequi cum temporibus in
        aperiam, animi quae laborum eos voluptates similique repellendus sunt
        repellat perspiciatis voluptas, natus suscipit placeat ut fuga odit
        nostrum eum aut at ea dolor commodi. Soluta est libero error explicabo
        veniam accusantium tempora dignissimos esse, iusto, omnis in, nesciunt
        non possimus earum nostrum. Neque, labore, odit, distinctio accusamus
        perferendis suscipit atque praesentium natus doloremque numquam eveniet
        sequi amet itaque soluta eos unde voluptates quam perspiciatis. Deserunt
        quis natus perferendis, iste esse quo fugiat nesciunt odit, deleniti
        repellat quia recusandae optio tempora velit ipsum doloremque facere.
        Vel optio nobis facilis distinctio, eius quis veniam laboriosam hic
        numquam corrupti recusandae, esse praesentium adipisci, illo alias
        fugiat quasi? Corrupti corporis dolores minus adipisci, mollitia
        asperiores autem consequuntur voluptatibus, distinctio, doloremque
        doloribus nisi provident nesciunt suscipit repellat eius exercitationem
        itaque rem. Quisquam excepturi hic velit expedita animi, harum quasi
        adipisci recusandae consequuntur necessitatibus culpa aspernatur
        voluptates qui laborum ad id inventore. Reprehenderit, aperiam. Itaque
        autem inventore consequatur dolorem ullam expedita eaque est iusto
        assumenda amet minima eos, aperiam laborum impedit, ducimus ab. Esse eum
        ad maxime impedit cum ut similique odit assumenda hic aut possimus rerum
        quibusdam vero voluptatibus sit vel, mollitia aliquam praesentium iusto?
        Quisquam iure labore magnam necessitatibus sequi quaerat inventore vel
        laborum consectetur, vero distinctio ab quam quos sapiente cupiditate
        rerum deleniti illo recusandae delectus dicta maiores aliquam nisi
        commodi. Nulla quos est at amet assumenda sequi. Similique saepe nisi
        blanditiis reiciendis ut ducimus, nostrum consequatur nam voluptatibus,
        qui veritatis voluptates inventore vel facere laboriosam recusandae
        veniam. Optio dolor tempora assumenda mollitia hic unde earum error in
        eveniet molestiae accusamus dolore omnis sint alias quaerat voluptates
        rem, similique saepe. Maiores est harum id, sapiente tempora incidunt
        quis cumque dolor ea, saepe veritatis voluptatum molestias deserunt,
        mollitia quia libero iure molestiae velit numquam cupiditate similique
        placeat dolores nihil consequuntur? Accusamus, suscipit voluptas, saepe
        non tenetur molestias modi ipsa ea laudantium mollitia, possimus porro
        molestiae voluptatum quibusdam at vero est corrupti! Esse ut earum
        laudantium deserunt labore facere maiores impedit adipisci commodi aut,
        molestias explicabo hic aliquam vel voluptatibus voluptatum reiciendis
        ducimus architecto provident atque assumenda unde corporis omnis libero.
        Itaque veniam inventore doloremque dolores minima id quis, fuga aliquid
        amet est suscipit culpa illo tempore mollitia maxime temporibus soluta
        incidunt doloribus cum. Placeat, natus quis? Possimus earum nam non
        itaque ullam dignissimos laudantium quis hic voluptates modi laboriosam
        tenetur, dolor alias animi dolores unde quidem soluta quaerat pariatur
        vitae odio magni. Inventore ratione voluptates libero delectus vero
        earum doloribus alias qui quaerat nulla.
      </p>
      <Button className="cursor-pointer" onClick={logOut}>
        Logout
      </Button>
    </div>
  );
}

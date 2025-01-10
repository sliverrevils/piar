import { deleteFileAction } from "@/Server/actions_files/uploadActions";
import UploadForm from "../components/common/UploadFiles/UpoadFiles";

import ThreeModelViewer from "../components/view/ThreeModelViewer/ThreeModelViewer";

import Link from "next/link";
import BabylonModelWithAnimation from "../components/view/BabylonModelViewer/BabylonModelViewer";

export default function Admin() {
    return (
        <main>
            <h1>Admin panel</h1>
            <ul>
                <li>
                    <Link href={`admin/items/create`}> Create item</Link>
                </li>
            </ul>
            <UploadForm />
            {/* <ModelViewer modelPath={"/uploads/test.glb"} /> */}
            <div
                style={{
                    // border: "2px solid red",
                    width: "100vw",
                    height: "100svh",
                    position: "relative",

                    //background: "tomato",
                }}
            >
                {/* <ThreeModelViewer modelPath="/uploads/monkey_double_nla1.glb" /> */}
                {/* <BabylonModelWithAnimation modelPath="uploads/boxes_anim1.glb" /> */}
                {/* <BabylonModelWithAnimation modelPath="uploads/divan.glb" hdrPath="hdr/studio_small_09_2k.hdr" /> */}
                {/* <BabylonModelWithAnimation modelPath="uploads/divan_anim3_named_attom_uv.glb" roomPath="uploads\room.glb" /> */}
                {/* <BabylonModelWithAnimation modelPath="uploads\mossy_brick_2k.glb" /> */}
                {/* <BabylonModelWithAnimation modelPath="gltf/materials.gltf" /> */}
                {/* <BabylonModelWithAnimation modelPath="uploads\taurus_otom.glb" /> */}
                <BabylonModelWithAnimation modelPath="uploads\taurus_otom_anim.glb" />
            </div>
        </main>
    );
}

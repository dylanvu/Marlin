import {
  useGLTF,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import React from "react";
import { useThree } from "@react-three/fiber";

export default function Model() {
  const { viewport } = useThree();
  const { nodes } = useGLTF("/shards.glb");

  return (
    <group scale={viewport.width / 1.5}>
      {nodes.Scene.children.map((mesh, i) => {
        return <Mesh data={mesh} key={i} />;
      })}
    </group>
  );
}

function Mesh({ data }) {
  const materialProps = {
    thickness: 0.275,
    ior: 1.8,
    chromaticAberration: 0.75,
    resolution: 1,
  };

  return (
    <Float>
      <mesh {...data}>
        <MeshTransmissionMaterial
          roughness={0}
          transmission={0.99}
          {...materialProps}
        />
      </mesh>
    </Float>
  );
}

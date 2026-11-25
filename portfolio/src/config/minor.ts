export const minor = {
  eyebrow: 'Smaller work',
  title: 'Experiments and prototypes',
  text: 'Shorter projects and explorations.',
  items: [
    {
      title: 'Blockchain win',
      line: 'An on-chain passport, shown in Berlin.',
      text: 'With Stefanos and Omar, we built digital product passports verified on-chain. An escrow system that rewards material recycling through underlying smart contracts. Top 3 out of 60+ teams, presented to web3 experts at the MasterZ showcase in Berlin.',
      tag: 'onchain',
      images: [
        {
          src: '/experiments/iota-berlin.jpg',
          alt: 'The team at the MasterZ builder showcase, W3 Hub Berlin, 25 September 2026.',
          position: 'center 62%',
          tall: true,
        },
      ],
      links: [
        { href: 'https://lnkd.in/p/eJgP-GZC', label: 'Berlin showcase', external: true },
        { href: 'https://iota2-seven.vercel.app/', label: 'T-shirt tracer', external: true },
      ],
    },
    {
      title: 'WardBot',
      line: 'An experiment, not a client job.',
      text: 'An AI agent that answers questions about my work, built on a knowledge graph of my projects. Every fact carries its provenance, provided, extracted, inferred, or hand-edited, so you can see where an answer comes from. I designed and built it end to end.',
      image: '/experiments/wardbot.png',
      imageAlt: 'WardBot explorer. The principle “what to do” is open, with the rules that apply to it.',
      links: [{ href: 'https://wardbot.vercel.app/?layer=wardbot', label: 'WardBot', external: true }],
    },
    {
      title: 'Safety training',
      line: 'My final graduation project. Safety advice, in the room with the operator.',
      text: 'I designed and coded it in Unity, during AR/VR evening classes last year. An assistant that gives safety advice and instructions to the operator.',
      image: '/experiments/safety-training.jpg',
      imageAlt: 'An XR safety scene. A robot assistant talks with a factory operator beside the tanks.',
      imageFit: 'contain',
    },
    {
      title: 'MoMuse',
      line: 'A digital museum assistant for the Antwerp Fashion Museum.',
      text: 'It explains a garment in plain language, and tells a different story depending on who asks. It won the MoMu Fashion Hackathon. Built with a 3D viewer, hotspots, and a product-passport control.',
      tag: 'voice',
      image: '/experiments/momuse.jpg',
      imageAlt: 'MoMuse 3D viewer of the Kasuri kimono, with hotspots and a product passport control.',
      imagePosition: '72% 42%',
      links: [
        { href: 'https://momuse.vercel.app/', label: 'momuse.vercel.app', external: true },
        { href: 'https://11labs-rust.vercel.app/', label: 'ElevenLabs', external: true },
      ],
    },
  ] as {
    title: string;
    line: string;
    text?: string;
    tag?: string;
    href?: string;
    external?: boolean;
    linkLabel?: string;
    links?: { href: string; label: string; external?: boolean }[];
    image?: string;
    imageAlt?: string;
    imagePosition?: string;
    imageFit?: string;
    images?: { src: string; alt: string; position?: string; fit?: string }[];
  }[],
};

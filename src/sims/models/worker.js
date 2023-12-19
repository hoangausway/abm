const analysis = ({ params, agents }) => {
  const neighborhood = (r, ag) => {
    return (nb) =>
      nb !== ag &&
      Math.pow(ag.x - nb.x, 2) + Math.pow(ag.y - nb.y, 2) < Math.pow(r, 2);
  };

  if (!agents || agents.length === 0) {
    return { data: 0 };
  }

  const { r, th } = params;
  const nSat = agents.reduce((acc, a) => {
    // get neighborhood
    const neighbors = agents.filter(neighborhood(r, a));
    if (neighborhood.length === 0) {
      return acc + 1;
    }

    const nbs = neighbors.filter((nb) => nb.type === a.type);
    const q = nbs.length / neighbors.length;
    if (q >= th) {
      return acc + 1;
    }
    return acc;
  }, 0);

  return { data: Number(nSat / agents.length).toFixed(2) };
};


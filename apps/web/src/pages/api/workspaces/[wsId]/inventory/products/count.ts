import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { wsId } = req.query;

    if (!wsId || typeof wsId !== 'string') throw new Error('Invalid wsId');

    switch (req.method) {
      case 'GET':
        return await fetchCount(req, res, wsId);

      default:
        throw new Error(
          `The HTTP ${req.method} method is not supported at this route.`
        );
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        message: 'Something went wrong',
      },
    });
  }
};

export default handler;

const fetchCount = async (
  req: NextApiRequest,
  res: NextApiResponse,
  wsId: string
) => {
  const supabase = createPagesServerClient({
    req,
    res,
  });

  const wsProducts = supabase.rpc('get_workspace_products_count', {
    ws_id: wsId,
  });

  const inventoryProducts = supabase.rpc('get_inventory_products_count', {
    ws_id: wsId,
  });

  const [ws, inventory] = await Promise.all([wsProducts, inventoryProducts]);

  if (ws.error) return res.status(401).json({ error: ws.error.message });

  if (inventory.error)
    return res.status(401).json({ error: inventory.error.message });

  return res.status(200).json({
    ws: ws.data,
    inventory: inventory.data,
  });
};

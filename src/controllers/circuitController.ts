import { Request, Response } from "express";
import { Circuit } from "../models/circuitModel";
import { Race } from "../models/raceModel"; // Assuming Race model is used to track races at circuits

export const getCircuits = async (req: Request, res: Response) => {
  try {
    const search = req.query.search;

    // Fetch circuits based on search query, or fetch all circuits
    const circuits = search
      ? await Circuit.find({
          circuit_id: { $regex: new RegExp(search as string, "i") },
        })
      : await Circuit.find();

    // For each circuit, fetch associated races and populate driver information
    const circuitsWithDrivers = await Promise.all(
      circuits.map(async (circuit) => {
        const races = await Race.find({
          circuit_id: circuit.circuit_id,
        }).populate({
          path: "race_results.driver_id", // Assuming race_results stores driver references
          select: "givenName familyName nationality image countryCode", // Select relevant driver fields
        });

        // Attach drivers to the circuit (you can add this info to the response)
        const drivers = races
          .flatMap((race) => race.race_results)
          .map((result) => result.driver_id);

        return {
          ...circuit.toObject(),
          drivers,
        };
      })
    );

    res.status(200).json({ status: "success", data: circuitsWithDrivers });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

// Create a circuit
export const createCircuit = async (req: Request, res: Response) => {
  try {
    const circuit = new Circuit(req.body);
    await circuit.save();
    res.status(201).json({ status: "success", data: circuit });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
};

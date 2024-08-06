import prisma from "@/helpers/prismaHelper";
import {
	internalServerErrorResponse,
	optionsResponse,
	successResponse,
	notFoundResponse,
} from "@/helpers/apiHelper";
import { NextRequest } from "next/server";
import { verifyToken } from "@/utils/jwt";